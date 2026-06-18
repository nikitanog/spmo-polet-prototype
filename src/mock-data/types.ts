export interface Theme {
  id: string;
  name: string;
  objects: { id: string; name: string }[];
}

export interface Parameter {
  id: string;
  name: string;
  type: string;
  unit: string;
  min: number;
  max: number;
  description: string;
  subdivision: string;
  category: string;
}

export interface Marker {
  id: string;
  time: number;
  comment: string;
}

export interface Fault {
  id: string;
  start: number;
  end: number;
  type: string;
  param: string;
}

export interface Trajectory {
  id: string;
  name: string;
  params: string[];
  data: Record<string, number[]>;
}

export interface Alarm {
  id: string;
  param: string;
  value: number;
  threshold: number;
  status: 'critical' | 'warning';
  time: number;
  message: string;
}

export interface TelemetryValue {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'ok' | 'warning' | 'critical';
}
