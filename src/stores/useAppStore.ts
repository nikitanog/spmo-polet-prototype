import { create } from 'zustand';
import type { Theme, Trajectory, Marker, Fault } from '../mock-data/types';
import {
  mockTopics,
  mockTrajectories,
  mockMarkers,
  mockFaults,
} from '../mock-data';

type MarkerSetMode = 'off' | 'set' | 'del';

interface AppState {
  mode: 'flight' | 'analysis';
  selectedTopicId: string | null;
  selectedObjectId: string | null;
  activeTrajectoryId: string | null;
  markers: Marker[];
  faults: Fault[];
  themes: Theme[];
  trajectories: Trajectory[];
  markerSetMode: MarkerSetMode;
  exited: boolean;

  setMode: (mode: 'flight' | 'analysis') => void;
  selectTopic: (id: string) => void;
  selectObject: (id: string) => void;
  setActiveTrajectory: (id: string | null) => void;
  addMarker: (marker: Marker) => void;
  removeMarker: (id: string) => void;
  clearMarkers: () => void;
  setMarkers: (markers: Marker[]) => void;
  addTopic: (name: string) => void;
  addObject: (topicId: string, name: string) => void;
  addTrajectory: (traj: Trajectory) => void;
  setMarkerSetMode: (mode: MarkerSetMode) => void;
  exitApp: () => void;
  resetExit: () => void;
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
  markerSetMode: 'off',
  exited: false,

  setMode: (mode) => set({ mode }),
  selectTopic: (id) => set({ selectedTopicId: id, selectedObjectId: null }),
  selectObject: (id) => set({ selectedObjectId: id }),
  setActiveTrajectory: (id) => set({ activeTrajectoryId: id }),
  addMarker: (marker) => set((s) => ({ markers: [...s.markers, marker] })),
  removeMarker: (id) => set((s) => ({ markers: s.markers.filter((m) => m.id !== id) })),
  clearMarkers: () => set({ markers: [] }),
  setMarkers: (markers) => set({ markers }),
  addTopic: (name) => set((s) => {
    const newTopic: Theme = { id: `t${Date.now()}`, name, objects: [] };
    return { themes: [...s.themes, newTopic] };
  }),
  addObject: (topicId, name) => set((s) => ({
    themes: s.themes.map((t) =>
      t.id === topicId
        ? { ...t, objects: [...t.objects, { id: `o${Date.now()}`, name }] }
        : t
    ),
  })),
  addTrajectory: (traj) => set((s) => ({
    trajectories: [...s.trajectories, traj],
    activeTrajectoryId: traj.id,
  })),
  setMarkerSetMode: (mode) => set({ markerSetMode: mode }),
  exitApp: () => set({
    exited: true,
    selectedTopicId: null,
    selectedObjectId: null,
    activeTrajectoryId: null,
    markerSetMode: 'off',
  }),
  resetExit: () => set({ exited: false }),
}));
