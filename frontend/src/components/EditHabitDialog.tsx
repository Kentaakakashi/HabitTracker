import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Habit, Frequency } from '../backend';
import IconPicker from './IconPicker';
import ColorPicker from './ColorPicker';
import { useUpdateHabit } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';

interface EditHabitDialogProps {
  habit: Habit;
  open: boolean;
  onClose: () => void;
}

export default function EditHabitDialog({ habit, open, onClose }: EditHabitDialogProps) {
  const [name, setName] = useState(habit.name);
  const [unit, setUnit] = useState(habit.unit);
  const [icon, setIcon] = useState(habit.icon);
  const [color, setColor] = useState(habit.color);
  const [target, setTarget] = useState(String(Number(habit.target)));
  const [frequency, setFrequency] = useState<Frequency>(habit.frequency);

  useEffect(() => {
    setName(habit.name);
    setUnit(habit.unit);
    setIcon(habit.icon);
    setColor(habit.color);
    setTarget(String(Number(habit.target)));
    setFrequency(habit.frequency);
  }, [habit]);

  const updateHabit = useUpdateHabit();

  const handleSave = async () => {
    await updateHabit.mutateAsync({
      id: habit.id,
      name: name.trim(),
      unit: unit.trim(),
      icon,
      color,
      target: BigInt(parseInt(target) || 1),
      frequency,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Unit</Label>
              <Input value={unit} onChange={(e) => setUnit(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Target</Label>
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
          <Button onClick={handleSave} disabled={!name.trim() || updateHabit.isPending}>
            {updateHabit.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
