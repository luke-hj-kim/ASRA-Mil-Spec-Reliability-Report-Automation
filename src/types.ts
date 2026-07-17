export interface Requirement {
  id: string;
  category: string;
  value: string;
  source: string;
}

export interface Conflict {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
}

export interface Question {
  id: string;
  text: string;
  context: string;
}

export interface AnalysisResult {
  requirements: Requirement[];
  conflicts: Conflict[];
  questions: Question[];
}

export interface AppState {
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  confirmedData: Record<string, string>;
  generatedDoc: string | null;
}
