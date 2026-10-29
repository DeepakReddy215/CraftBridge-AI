import math
from typing import List, Tuple
import numpy as np

def rgb_to_lab(r: float, g: float, b: float) -> Tuple[float, float, float]:
    """
    Standard sRGB to CIE-L*a*b* conversion using NumPy / standard math.
    """
    # Normalize sRGB
    r = r / 255.0
    g = g / 255.0
    b = b / 255.0

    # Gamma correction
    r = ((r + 0.055) / 1.055) ** 2.4 if r > 0.04045 else r / 12.92
    g = ((g + 0.055) / 1.055) ** 2.4 if g > 0.04045 else g / 12.92
    b = ((b + 0.055) / 1.055) ** 2.4 if b > 0.04045 else b / 12.92

    # Observer. = 2°, Illuminant = D65
    X = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047
    Y = (r * 0.2126729 + g * 0.7151522 + b * 0.0721750) / 1.00000
    Z = (r * 0.0193339 + g * 0.1191920 + b * 0.9503041) / 1.08883

    fx = X ** (1.0 / 3.0) if X > 0.008856 else (7.787 * X) + (16.0 / 116.0)
    fy = Y ** (1.0 / 3.0) if Y > 0.008856 else (7.787 * Y) + (16.0 / 116.0)
    fz = Z ** (1.0 / 3.0) if Z > 0.008856 else (7.787 * Z) + (16.0 / 116.0)

    L = (116.0 * fy) - 16.0
    a = 500.0 * (fx - fy)
    b_val = 200.0 * (fy - fz)

    return L, a, b_val

def hex_to_rgb(hex_code: str) -> Tuple[int, int, int]:
    clean = hex_code.lstrip("#")
    if len(clean) == 3:
        clean = "".join([c * 2 for c in clean])
    if len(clean) != 6:
        return 128, 128, 128
    return int(clean[0:2], 16), int(clean[2:4], 16), int(clean[4:6], 16)

def delta_e_cie76(lab1: Tuple[float, float, float], lab2: Tuple[float, float, float]) -> float:
    return math.sqrt(
        (lab1[0] - lab2[0]) ** 2 + (lab1[1] - lab2[1]) ** 2 + (lab1[2] - lab2[2]) ** 2
    )

def extract_dominant_colors_kmeans(pixels: np.ndarray, k: int = 4, max_iter: int = 15) -> List[Tuple[int, int, int]]:
    """
    Lightweight numpy k-means (k=4) clustering without requiring scipy or sklearn.
    """
    if len(pixels) == 0:
        return [(200, 90, 32)]

    # Downsample if too large to conserve 512MB RAM target
    if len(pixels) > 5000:
        indices = np.random.choice(len(pixels), 5000, replace=False)
        pts = pixels[indices].astype(np.float32)
    else:
        pts = pixels.astype(np.float32)

    # Initialize centroids randomly from points
    num_pts = len(pts)
    actual_k = min(k, num_pts)
    initial_idx = np.random.choice(num_pts, actual_k, replace=False)
    centroids = pts[initial_idx].copy()

    for _ in range(max_iter):
        # Compute distances from each point to each centroid
        # shape: (num_pts, actual_k)
        diff = pts[:, np.newaxis, :] - centroids[np.newaxis, :, :]
        dist_sq = np.sum(diff ** 2, axis=2)
        labels = np.argmin(dist_sq, axis=1)

        new_centroids = []
        for i in range(actual_k):
            members = pts[labels == i]
            if len(members) > 0:
                new_centroids.append(np.mean(members, axis=0))
            else:
                new_centroids.append(centroids[i])
        centroids = np.array(new_centroids)

    return [(int(c[0]), int(c[1]), int(c[2])) for c in centroids]

def evaluate_palette_match(extracted_rgb: List[Tuple[int, int, int]], requested_hexes: List[str]) -> float:
    """
    Calculates colour match percentage (0..100) using minimum CIE-L*a*b* distance.
    Delta E < 5 is imperceptible to human eye; Delta E < 15 is harmonious match.
    """
    if not requested_hexes:
        return 85.0

    target_labs = [rgb_to_lab(*hex_to_rgb(h)) for h in requested_hexes]
    extracted_labs = [rgb_to_lab(*rgb) for rgb in extracted_rgb]

    total_best_score = 0.0
    for t_lab in target_labs:
        min_de = min(delta_e_cie76(t_lab, e_lab) for e_lab in extracted_labs)
        # Scale: Delta E = 0 -> 100%, Delta E >= 45 -> 0%
        score = max(0.0, min(100.0, 100.0 - (min_de * 2.2)))
        total_best_score += score

    return round(total_best_score / len(target_labs), 1)
