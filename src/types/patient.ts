export interface PatientData {
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  symptoms: string[];
  otherSymptoms: string;
  existingConditions: string;
  consentGiven: boolean;
}

export interface ScanData {
  file: File | null;
  capturedImage: string | null;
  uploadMethod: 'file' | 'camera' | null;
}

export interface DiagnosisResult {
  disease: 'Normal' | 'Pneumonia' | 'Tuberculosis' | 'COPD' | 'Lung Cancer';
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  affectedRegions: string[];
  recommendations: string[];
  heatmapUrl: string;
}

export interface AnalysisReport {
  id: string;
  patientData: PatientData;
  scanData: ScanData;
  result: DiagnosisResult;
  createdAt: Date;
}