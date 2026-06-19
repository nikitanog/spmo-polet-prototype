import { create } from 'zustand';
import { mockParams } from '../mock-data';

interface TableState {
  selectedParamIds: string[];
  stepSize: number;
  numberFormat: string;
  setSelectedParamIds: (ids: string[]) => void;
  setStepSize: (n: number) => void;
  setNumberFormat: (fmt: string) => void;
}

export const useTableStore = create<TableState>((set) => ({
  selectedParamIds: mockParams.slice(0, 5).map((p) => p.id),
  stepSize: 10,
  numberFormat: '0.00',
  setSelectedParamIds: (ids) => set({ selectedParamIds: ids }),
  setStepSize: (n) => set({ stepSize: n }),
  setNumberFormat: (fmt) => set({ numberFormat: fmt }),
}));
