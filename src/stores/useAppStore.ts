import { create } from 'zustand';
import type { Theme, Trajectory, Marker, Fault } from '../mock-data/types';
import {
  mockTopics,
  mockTrajectories,
  mockMarkers,
  mockFaults,
} from '../mock-data';

interface AppState {
  mode: 'flight' | 'analysis';
  selectedTopicId: string | null;
  selectedObjectId: string | null;
  activeTrajectoryId: string | null;
  markers: Marker[];
  faults: Fault[];
  themes: Theme[];
  trajectories: Trajectory[];

  setMode: (mode: 'flight' | 'analysis') => void;
  selectTopic: (id: string) => void;
  selectObject: (id: string) => void;
  setActiveTrajectory: (id: string | null) => void;
  addMarker: (marker: Marker) => void;
  removeMarker: (id: string) => void;
  clearMarkers: () => void;
  setMarkers: (markers: Marker[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'analysis',
  selectedTopicId: null,
  selectedObjectId: null,
  activeTrajectoryId: null,
  markers: mockMarkers,
  faults: mockFaults,
  themes: mockTopics,
  trajectories: mockTrajectories,

  setMode: (mode) => set({ mode }),
  selectTopic: (id) => set({ selectedTopicId: id, selectedObjectId: null }),
  selectObject: (id) => set({ selectedObjectId: id }),
  setActiveTrajectory: (id) => set({ activeTrajectoryId: id }),
  addMarker: (marker) => set((s) => ({ markers: [...s.markers, marker] })),
  removeMarker: (id) => set((s) => ({ markers: s.markers.filter((m) => m.id !== id) })),
  clearMarkers: () => set({ markers: [] }),
  setMarkers: (markers) => set({ markers }),
}));
