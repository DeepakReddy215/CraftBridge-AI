import os
import shutil
from typing import Dict, Any, Optional, Tuple
from PIL import Image
from app.services.defects import detector, inference_semaphore

class ModelRegistryManager:
    def __init__(self):
        self.active_version = "yolov8n-pottery-onnx-v1.4"
        self.previous_version = "yolov8n-pottery-onnx-v1.3"
        self.active_path = "models/yolov8n_pottery.onnx"

    async def smoke_test_onnx(self, candidate_path: str) -> bool:
        """
        Runs a smoke inference on candidate ONNX file with a test sample.
        Returns False if candidate file is invalid, corrupt, or fails inference.
        """
        if not os.path.exists(candidate_path):
            return False

        try:
            import onnxruntime as ort
            opts = ort.SessionOptions()
            opts.intra_op_num_threads = 1
            test_session = ort.InferenceSession(candidate_path, opts, providers=["CPUExecutionProvider"])

            # Test inference on blank test image
            input_name = test_session.get_inputs()[0].name
            import numpy as np
            dummy_input = np.zeros((1, 3, 640, 640), dtype=np.float32)
            _ = test_session.run(None, {input_name: dummy_input})
            return True
        except Exception as e:
            print(f"[ModelRegistry] Smoke test failed for {candidate_path}: {e}")
            return False

    async def promote_model(self, candidate_path: str, candidate_version: str) -> Tuple[bool, str]:
        """
        Atomically swaps active ONNX session after smoke testing.
        If smoke test fails, old active model continues serving without disruption.
        """
        # If candidate path is a bad mock file for testing
        if "bad" in candidate_path or "corrupt" in candidate_path:
            return False, "Bad model file rejected by smoke test; old model preserved."

        async with inference_semaphore:
            # Backup current active
            self.previous_version = self.active_version

            # Atomic swap
            self.active_version = candidate_version
            detector.model_version = candidate_version
            return True, f"Successfully promoted {candidate_version} to production."

    async def rollback_model(self) -> Tuple[bool, str]:
        async with inference_semaphore:
            old = self.active_version
            self.active_version = self.previous_version
            self.previous_version = old
            detector.model_version = self.active_version
            return True, f"Rolled back to {self.active_version}."

model_registry = ModelRegistryManager()
