export interface QuantityDTO {
  value: number;
  unit: string;
}

export interface MeasurementApiRequest {
  category: string;
  value1: QuantityDTO;
  value2?: QuantityDTO;
  targetUnit?: string;
}

export interface MeasurementHistory {
  id: number;
  operationType: string;
  inputDetails: string;
  result: string;
  timestamp: string;
  userId?: number;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user?: string;
  token?: string;
}

export interface User {
  username: string;
  token: string;
}

export const UNITS: Record<string, string[]> = {
  length: ['Inches', 'Feet', 'Yards', 'Centimeters'],
  weight: ['Grams', 'Kilograms', 'Pound'],
  volume: ['Litre', 'MilliLiter', 'Gallon'],
  temperature: ['Celsius', 'Fahrenheit', 'Kelvin']
};

export const CATEGORIES = ['length', 'weight', 'volume', 'temperature'];

export const OPERATIONS = [
  { key: 'convert', label: 'Convert', icon: '⇄', needsTwo: false, needsTarget: true },
  { key: 'add', label: 'Add', icon: '+', needsTwo: true, needsTarget: true },
  { key: 'subtract', label: 'Subtract', icon: '−', needsTwo: true, needsTarget: true },
  { key: 'divide', label: 'Divide', icon: '÷', needsTwo: true, needsTarget: false },
  { key: 'compare', label: 'Compare', icon: '=', needsTwo: true, needsTarget: false }
];
