import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HabitType, Frequency } from '../backend';
import { BUILT_IN_HABITS, BuiltInHabitConfig } from '../types/habit';
import HabitTypeSelector from './HabitTypeSelector';
import IconPicker from './IconPicker';
import ColorPicker from './ColorPicker';
import { useCreateHabit } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';

interface CustomHabitBuilderProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function CustomHabitBuilder({ open, onClose, onCreated }: CustomHabitBuilderProps) {
  const [tab, setTab] = useState<'builtin' | 'custom'>('builtin');
  const [selectedBuiltIn, setSelectedBuiltIn] = useState<BuiltInHabitConfig | null>(null);

  // Custom form state
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [icon, setIcon] = useState(0);
  const [color, setColor] = useState('#34d399');
  const [target, setTarget] = useState('1');
  const [habitType, setHabitType] = useState<HabitType>(HabitType.numeric);
  const [frequency, setFrequency] = useState<Frequency>(Frequency.daily);

  const createHabit = useCreateHabit();

  const handleSelectBuiltIn = (config: BuiltInHabitConfig) => {
    setSelectedBuiltIn(config);
  };

  const handleCreateBuiltIn = async () => {
    if (!selectedBuiltIn) return;
    await createHabit.mutateAsync({
      name: selectedBuiltIn.name,
      habitType: selectedBuiltIn.habitType,
      unit: selectedBuiltIn.unit,
      icon: selectedBuiltIn.icon,
      color: selectedBuiltIn.color,
      target: BigInt(selectedBuiltIn.target),
      frequency: selectedBuiltIn.frequency,
    });
    onCreated?.();
    onClose();
    setSelectedBuiltIn(null);
  };

  const handleCreateCustom = async () => {
    if (!name.trim()) return;
    await createHabit.mutateAsync({
      name: name.trim(),
      habitType,
      unit: unit.trim() || 'units',
      icon,
      color,
      target: BigInt(parseInt(target) || 1),
      frequency,
    });
    onCreated?.();
    onClose();
    resetCustomForm();
  };

  const resetCustomForm = () => {
    setName('');
    setUnit('');
    setIcon(0);
    setColor('#34d399');
    setTarget('1');
    setHabitType(HabitType.numeric);
    setFrequency(Frequency.daily);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Habit</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as 'builtin' | 'custom')}>
          <TabsList className="w-full">
            <TabsTrigger value="builtin" className="flex-1">Built-in Types</TabsTrigger>
            <TabsTrigger value="custom" className="flex-1">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="builtin" className="space-y-4 mt-4">
            <HabitTypeSelector
              onSelect={handleSelectBuiltIn}
              selected={selectedBuiltIn?.name}
            />
            {selectedBuiltIn && (
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <p className="font-semibold">{selectedBuiltIn.emoji} {selectedBuiltIn.name}</p>
                <p className="text-muted-foreground">{selectedBuiltIn.description}</p>
                <p className="text-muted-foreground">Default target: {selectedBuiltIn.target} {selectedBuiltIn.unit}/day</p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button
                onClick={handleCreateBuiltIn}
                disabled={!selectedBuiltIn || createHabit.isPending}
              >
                {createHabit.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Add Habit
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div>
                <Label>Habit Name</Label>
                <Input
                  placeholder="e.g. Morning Run"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Unit</Label>
                  <Input
                    placeholder="e.g. km, pages"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Daily Target</Label>
                  <Input
                    type="number"
                    min="1"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Input Type</Label>
                <RadioGroup
                  value={habitType}
                  onValueChange={(v) => setHabitType(v as HabitType)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={HabitType.numeric} id="type-numeric" />
                    <Label htmlFor="type-numeric">Numeric</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={HabitType.boolean_} id="type-bool" />
                    <Label htmlFor="type-bool">Yes/No</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={HabitType.text} id="type-text" />
                    <Label htmlFor="type-text">Tasks</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Frequency</Label>
                <Select value={frequency} onValueChange={(v) => setFrequency(v as Frequency)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Frequency.daily}>Daily</SelectItem>
                    <SelectItem value={Frequency.weekly}>Weekly</SelectItem>
                    <SelectItem value={Frequency.monthly}>Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Icon</Label>
                <div className="mt-2">
                  <IconPicker selected={icon} onChange={setIcon} />
                </div>
              </div>

              <div>
                <Label>Color</Label>
                <div className="mt-2">
                  <ColorPicker selected={color} onChange={setColor} />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button
                onClick={handleCreateCustom}
                disabled={!name.trim() || createHabit.isPending}
              >
                {createHabit.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Create Habit
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
