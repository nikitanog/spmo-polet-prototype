import { create } from 'zustand';
import type { Screen, ScreenWindow } from '../mock-data/types';
import { mockScreens } from '../mock-data';

interface ScreenState {
  screens: Screen[];
  selectedId: string | null;
  selectScreen: (id: string | null) => void;
  addScreen: (name: string) => void;
  removeScreen: (id: string) => void;
  renameScreen: (id: string, name: string) => void;
  addWindow: (screenId: string, type: ScreenWindow['type'], params?: string[]) => void;
  removeWindow: (screenId: string, windowId: string) => void;
  updateWindowParams: (screenId: string, windowId: string, params: string[]) => void;
  reorderWindows: (screenId: string, fromIdx: number, toIdx: number) => void;
}

let wc = 100;

export const useScreenStore = create<ScreenState>((set) => ({
  screens: mockScreens,
  selectedId: null,

  selectScreen: (id) => set({ selectedId: id }),

  addScreen: (name) => set((s) => ({
    screens: [...s.screens, { id: `s${Date.now()}`, name, windows: [], created: new Date().toISOString().slice(0, 10) }],
  })),

  removeScreen: (id) => set((s) => ({
    screens: s.screens.filter((sc) => sc.id !== id),
    selectedId: s.selectedId === id ? null : s.selectedId,
  })),

  renameScreen: (id, name) => set((s) => ({
    screens: s.screens.map((sc) => sc.id === id ? { ...sc, name } : sc),
  })),

  addWindow: (screenId, type, params = []) => set((s) => ({
    screens: s.screens.map((sc) => {
      if (sc.id !== screenId) return sc;
      const newWin: ScreenWindow = { id: `w${++wc}`, type, params };
      return { ...sc, windows: [...sc.windows, newWin] };
    }),
  })),

  removeWindow: (screenId, windowId) => set((s) => ({
    screens: s.screens.map((sc) =>
      sc.id === screenId ? { ...sc, windows: sc.windows.filter((w) => w.id !== windowId) } : sc
    ),
  })),

  updateWindowParams: (screenId, windowId, params) => set((s) => ({
    screens: s.screens.map((sc) =>
      sc.id === screenId
        ? { ...sc, windows: sc.windows.map((w) => w.id === windowId ? { ...w, params } : w) }
        : sc
    ),
  })),

  reorderWindows: (screenId, fromIdx, toIdx) => set((s) => ({
    screens: s.screens.map((sc) => {
      if (sc.id !== screenId) return sc;
      const arr = [...sc.windows];
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      return { ...sc, windows: arr };
    }),
  })),
}));
