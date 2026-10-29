import React, { useState } from 'react';
import { GlowCard } from '../ui/GlowCard';
import { Button } from '../ui/Button';
import { IconTile } from '../ui/IconTile';
import { Swatch } from '../ui/Swatch';
import { Slider } from '../ui/Slider';
import { 
  Coffee, 
  Wine, 
  Flower2, 
  Sparkles, 
  UploadCloud, 
  Layers, 
  Check, 
  Compass, 
  ArrowRight 
} from 'lucide-react';
import type { CraftRequest } from '../../types/api';

const PRODUCT_OPTIONS = [
  { id: 'Terracotta Vase', label: 'Terracotta Vase', desc: 'Fluted or smooth neck vase', icon: <Flower2 className="w-5 h-5 text-clay" /> },
  { id: 'Studio Ceramic Carafe', label: 'Ceramic Carafe', desc: 'Ergonomic table pouring pitcher', icon: <Wine className="w-5 h-5 text-clay" /> },
  { id: 'Planter Pot', label: 'Planter Pot', desc: 'Drainage saucer & textured walls', icon: <Layers className="w-5 h-5 text-clay" /> },
  { id: 'Tea Service Set', label: 'Tea Service Set', desc: 'Handled ritual teapot & cups', icon: <Coffee className="w-5 h-5 text-clay" /> },
  { id: 'Studio Bowl', label: 'Studio Bowl', desc: 'Wide shallow serving bowl', icon: <Sparkles className="w-5 h-5 text-clay" /> },
  { id: 'Sculptural Vessel', label: 'Art Vessel', desc: 'Abstract decorative centerpiece', icon: <Compass className="w-5 h-5 text-clay" /> },
];

const COLOR_SWATCHES = [
  { hex: '#c85a20', name: 'Terracotta Clay' },
  { hex: '#4fd1c5', name: 'Studio Teal' },
  { hex: '#14161b', name: 'Carbon Black' },
  { hex: '#efe9de', name: 'Desert Cream' },
  { hex: '#d97706', name: 'Ochre Amber' },
  { hex: '#65a30d', name: 'Sage Olive' },
  { hex: '#7c3aed', name: 'Indigo Cobalt' },
];

const SIZES = [
  { id: 'Small (12-18cm)', label: 'Small', dim: '12 – 18 cm', note: 'Desk, tabletop accent' },
  { id: 'Medium (18-25cm)', label: 'Medium', dim: '18 – 25 cm', note: 'Centerpiece vase, carafe' },
  { id: 'Large (25-35cm)', label: 'Large', dim: '25 – 35 cm', note: 'Floor vase, large planter' },
  { id: 'Statement (35cm+)', label: 'Statement', dim: '35 cm+', note: 'Architectural focal point' },
];

export interface RequestFormProps {
  onSubmit: (data: Partial<CraftRequest>) => Promise<void>;
  isLoading?: boolean;
}

export const RequestForm: React.FC<RequestFormProps> = ({ onSubmit, isLoading = false }) => {
  const [product, setProduct] = useState(PRODUCT_OPTIONS[1].id);
  const [style, setStyle] = useState('Modern Minimalist');
  const [selectedColors, setSelectedColors] = useState<string[]>(['#c85a20', '#14161b']);
  const [sizeLabel, setSizeLabel] = useState(SIZES[1].id);
  const [budget, setBudget] = useState(850);
  const [purpose, setPurpose] = useState('Centerpiece tabletop vessel with smooth matte touch');
  const [pattern, setPattern] = useState('Subtle vertical fluting along belly');
  const [previewImage, setPreviewImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'
  );

  const toggleColor = (hex: string) => {
    if (selectedColors.includes(hex)) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter((c) => c !== hex));
      }
    } else {
      if (selectedColors.length < 3) {
        setSelectedColors([...selectedColors, hex]);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      product,
      style,
      colors: selectedColors,
      size_label: sizeLabel,
      budget,
      purpose,
      pattern,
      reference_image_path: previewImage,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* 1. Product Silhouette Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-mono font-semibold uppercase tracking-wider text-tx flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-clay text-white text-[11px] flex items-center justify-center font-bold">1</span>
            Select Vessel Form
          </label>
          <span className="text-xs text-mu">Hand-thrown silhouettes</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PRODUCT_OPTIONS.map((item) => (
            <IconTile
              key={item.id}
              id={item.id}
              label={item.label}
              description={item.desc}
              icon={item.icon}
              selected={product === item.id}
              onClick={() => setProduct(item.id)}
            />
          ))}
        </div>
      </div>

      {/* 2. Color Palette & Glaze Swatches */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-mono font-semibold uppercase tracking-wider text-tx flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-clay text-white text-[11px] flex items-center justify-center font-bold">2</span>
            Glaze & Clay Color Swatches
          </label>
          <span className="text-xs text-mu">Select up to 3 tones</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-cardBorder">
          {COLOR_SWATCHES.map((swatch) => (
            <div key={swatch.hex} className="flex flex-col items-center gap-1">
              <Swatch
                color={swatch.hex}
                name={swatch.name}
                selected={selectedColors.includes(swatch.hex)}
                onClick={() => toggleColor(swatch.hex)}
              />
              <span className="text-[10px] text-mu font-mono truncate max-w-[70px]">{swatch.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Scale & Dimensions Silhouettes */}
      <div className="space-y-3">
        <label className="text-sm font-mono font-semibold uppercase tracking-wider text-tx flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-clay text-white text-[11px] flex items-center justify-center font-bold">3</span>
          Scale & Dimensions
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SIZES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSizeLabel(s.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                sizeLabel === s.id
                  ? 'bg-clay/10 border-clay shadow-md'
                  : 'bg-cardBg border-cardBorder hover:border-white/20'
              }`}
            >
              <div className="text-sm font-bold text-tx">{s.label}</div>
              <div className="text-xs font-mono text-clay font-medium">{s.dim}</div>
              <div className="text-[11px] text-mu mt-1">{s.note}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Budget Slider & Notes */}
      <div className="space-y-4 p-6 rounded-2xl bg-white/[0.02] border border-cardBorder">
        <label className="text-sm font-mono font-semibold uppercase tracking-wider text-tx flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-clay text-white text-[11px] flex items-center justify-center font-bold">4</span>
          Target Budget & Purpose
        </label>
        <Slider
          label="Patron Budget Ceiling (Estimate)"
          min={350}
          max={4500}
          step={50}
          value={budget}
          onChange={setBudget}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-tx/80 mb-1">Aesthetic Style / Finish</label>
            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-bg2 border border-cardBorder text-tx text-xs focus:ring-2 focus:ring-clay/50 focus:outline-none"
              placeholder="e.g. Modern Minimalist, Rustic Wabi-Sabi, Raw Terracotta"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-tx/80 mb-1">Texture / Pattern Motif</label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-bg2 border border-cardBorder text-tx text-xs focus:ring-2 focus:ring-clay/50 focus:outline-none"
              placeholder="e.g. Spiral ribs, chattered bands, chevron comb"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-tx/80 mb-1">Intended Purpose & Placement</label>
          <textarea
            rows={2}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-bg2 border border-cardBorder text-tx text-xs focus:ring-2 focus:ring-clay/50 focus:outline-none"
            placeholder="Describe where it will live, how it will be used..."
          />
        </div>
      </div>

      {/* 5. Reference Photo Upload */}
      <div className="space-y-3">
        <label className="text-sm font-mono font-semibold uppercase tracking-wider text-tx flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-clay text-white text-[11px] flex items-center justify-center font-bold">5</span>
          Visual Reference (Optional)
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-dashed border-cardBorder">
          {previewImage && (
            <img
              src={previewImage}
              alt="Reference preview"
              className="w-24 h-24 object-cover rounded-xl border border-cardBorder"
            />
          )}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs text-tx font-medium">Upload photo inspiration or sketch</p>
            <p className="text-[11px] text-mu mt-0.5">JPEG, PNG up to 5MB. Downscaled client-side automatically.</p>
            <label className="inline-block mt-2 cursor-pointer">
              <span className="text-xs font-mono text-clay hover:underline inline-flex items-center gap-1">
                <UploadCloud className="w-3.5 h-3.5" /> Choose local image
              </span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 flex justify-end">
        <Button
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Submit Request & Generate AI Brief
        </Button>
      </div>
    </form>
  );
};
