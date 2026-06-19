import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  mode: 'analysis' | 'flight';
  language: 'ru' | 'en';
  autosave: boolean;
  autosaveInterval: number;
  historyLength: number;
  polletPath: string;
  objectsPath: string;
  dbPath: string;
  trajectoriesPath: string;
  logsPath: string;
  colorScheme: 'light' | 'dark';
  font: 'system' | 'mono' | 'large';
  bgColor: string;
  showGrid: boolean;
  lineThickness: 'thin' | 'normal' | 'thick';
  interpolation: 'linear' | 'spline' | 'nearest';
  outlierSigma: number;
  defaultFilter: 'butterworth' | 'chebyshev' | 'median' | 'none';
  sampleRate: number;
  autoCalc: boolean;
  set: (vals: Partial<SettingsState>) => void;
  setMode: (mode: 'analysis' | 'flight') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      mode: 'analysis',
      language: 'ru',
      autosave: true,
      autosaveInterval: 5,
      historyLength: 10,
      polletPath: '/opt/spmo-polet/data',
      objectsPath: '/opt/spmo-polet/objects',
      dbPath: '/opt/spmo-polet/db/sbi_v5',
      trajectoriesPath: '/opt/spmo-polet/trajectories',
      logsPath: '/opt/spmo-polet/logs',
      colorScheme: 'light',
      font: 'system',
      bgColor: '#ffffff',
      showGrid: true,
      lineThickness: 'normal',
      interpolation: 'spline',
      outlierSigma: 3,
      defaultFilter: 'butterworth',
      sampleRate: 100,
      autoCalc: true,
      set: (vals) => set(vals),
      setMode: (mode) => { set({ mode }); },
    }),
    { name: 'spmo-settings' },
  ),
);
