import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CardStyle, BorderRadius } from '../backend';
import { ThemeDefinition } from '../themes/themeDefinitions';
import { useThemeContext } from '../context/ThemeContext';
import { Loader2 } from 'lucide-react';

interface CustomThemeBuilderProps {
  open: boolean;
  onClose: () => void;
}

export default function CustomThemeBuilder({ open, onClose }: CustomThemeBuilderProps) {
  const { addCustomTheme } = useThemeContext();
  const [primaryColor, setPrimaryColor] = useState('#34d399');
  const [backgroundColor, setBackgroundColor] = useState('#f7f7f5');
  const [accentColor, setAccentColor] = useState('#4db87a');
  const [cardStyle, setCardStyle] = useState<CardStyle>(CardStyle.shadow);
  const [borderRadius, setBorderRadius] = useState<BorderRadius>(BorderRadius.large);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const custom: ThemeDefinition = {
      id: `custom-${Date.now()}`,
      name: 'Custom',
      className: '',
      primaryColor,
      backgroundColor,
      accentColor,
      cardStyle,
      borderRadius,
      preview: {
        bg: backgroundColor,
        primary: primaryColor,
        accent: accentColor,
        card: '#ffffff',
      },
    };
    addCustomTheme(custom);
    setSaving(false);
    onClose();
  };

  const radiusLabel: Record<BorderRadius, string> = {
    [BorderRadius.none]: 'None',
    [BorderRadius.small]: 'Small',
    [BorderRadius.large]: 'Large',
    [BorderRadius.pill]: 'Pill',
  };

  const cardStyleLabel: Record<CardStyle, string> = {
    [CardStyle.flat]: 'Flat',
    [CardStyle.glass]: 'Glass',
    [CardStyle.shadow]: 'Shadow',
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Custom Theme Builder</DialogTitle>
        </DialogHeader>

        {/* Live Preview */}
        <div
          className="rounded-xl p-4 mb-2 border"
          style={{ backgroundColor, borderColor: primaryColor + '44' }}
        >
          <p className="text-xs font-bold mb-2" style={{ color: primaryColor }}>Live Preview</p>
          <div className="flex gap-2">
            <div
              className="flex-1 p-2 rounded text-xs font-semibold text-white text-center"
              style={{
                backgroundColor: primaryColor,
                borderRadius: borderRadius === BorderRadius.pill ? '999px' : borderRadius === BorderRadius.large ? '12px' : borderRadius === BorderRadius.small ? '4px' : '0px',
              }}
            >
              Primary
            </div>
            <div
              className="flex-1 p-2 rounded text-xs font-semibold text-white text-center"
              style={{
                backgroundColor: accentColor,
                borderRadius: borderRadius === BorderRadius.pill ? '999px' : borderRadius === BorderRadius.large ? '12px' : borderRadius === BorderRadius.small ? '4px' : '0px',
              }}
            >
              Accent
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Primary</Label>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="mt-1 w-full h-10 rounded-lg cursor-pointer border border-border"
              />
            </div>
            <div>
              <Label className="text-xs">Background</Label>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="mt-1 w-full h-10 rounded-lg cursor-pointer border border-border"
              />
            </div>
            <div>
              <Label className="text-xs">Accent</Label>
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="mt-1 w-full h-10 rounded-lg cursor-pointer border border-border"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold">Card Style</Label>
            <RadioGroup
              value={cardStyle}
              onValueChange={(v) => setCardStyle(v as CardStyle)}
              className="flex gap-4 mt-2"
            >
              {Object.values(CardStyle).map((cs) => (
                <div key={cs} className="flex items-center gap-1.5">
                  <RadioGroupItem value={cs} id={`cs-${cs}`} />
                  <Label htmlFor={`cs-${cs}`} className="text-sm">{cardStyleLabel[cs]}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-sm font-semibold">Border Radius</Label>
            <RadioGroup
              value={borderRadius}
              onValueChange={(v) => setBorderRadius(v as BorderRadius)}
              className="flex gap-3 mt-2 flex-wrap"
            >
              {Object.values(BorderRadius).map((br) => (
                <div key={br} className="flex items-center gap-1.5">
                  <RadioGroupItem value={br} id={`br-${br}`} />
                  <Label htmlFor={`br-${br}`} className="text-sm">{radiusLabel[br]}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Apply Theme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
