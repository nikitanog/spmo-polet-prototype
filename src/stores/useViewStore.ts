import { create } from 'zustand';

type ValuesMode = 'list' | 'table' | 'hidden';
type CursorMode = 'cross' | 'crossVal' | 'arrow' | 'vline';

interface ViewState {
  scalesVisible: boolean;
  valuesMode: ValuesMode;
  cursorMode: CursorMode;
  gridVisible: boolean;

  setScalesVisible: (v: boolean) => void;
  setValuesMode: (v: ValuesMode) => void;
  setCursorMode: (v: CursorMode) => void;
  setGridVisible: (v: boolean) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  scalesVisible: true,
  valuesMode: 'list',
  cursorMode: 'cross',
  gridVisible: true,

  setScalesVisible: (v) => set({ scalesVisible: v }),
  setValuesMode: (v) => set({ valuesMode: v }),
  setCursorMode: (v) => set({ cursorMode: v }),
  setGridVisible: (v) => set({ gridVisible: v }),
}));
