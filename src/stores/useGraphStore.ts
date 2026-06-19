import { create } from 'zustand';

export interface GraphFunction {
  id: string;
  paramName: string;
  color: string;
  thickness: number;
  lineType: 'solid' | 'dashed' | 'dotted';
  scale: 'left' | 'right';
  baseline: number;
  visible: boolean;
  yMin?: number;
  yMax?: number;
}

interface GraphState {
  functions: GraphFunction[];
  xAxisParam: string | null;
  autoLimits: boolean;

  addFunction: (fn: GraphFunction) => void;
  removeFunction: (id: string) => void;
  updateFunction: (id: string, data: Partial<GraphFunction>) => void;
  clearFunctions: () => void;
  setXAxisParam: (param: string | null) => void;
  setAutoLimits: (v: boolean) => void;
}

const colors = ['#1677ff', '#ff4d4f', '#52c41a', '#faad14', '#722ed1', '#13c2c2'];

export const useGraphStore = create<GraphState>((set) => ({
  functions: [
    { id: 'gf1', paramName: 'V_приборная_км_ч', color: colors[0], thickness: 1.5, lineType: 'solid', scale: 'left', baseline: 0, visible: true },
    { id: 'gf2', paramName: 'Крен_град', color: colors[1], thickness: 1.5, lineType: 'solid', scale: 'left', baseline: 0, visible: true },
  ],
  xAxisParam: null,
  autoLimits: true,

  addFunction: (fn) => set((s) => ({ functions: [...s.functions, fn] })),
  removeFunction: (id) => set((s) => ({ functions: s.functions.filter((f) => f.id !== id) })),
  updateFunction: (id, data) => set((s) => ({
    functions: s.functions.map((f) => (f.id === id ? { ...f, ...data } : f)),
  })),
  clearFunctions: () => set({ functions: [] }),
  setXAxisParam: (param) => set({ xAxisParam: param }),
  setAutoLimits: (v) => set({ autoLimits: v }),
}));
