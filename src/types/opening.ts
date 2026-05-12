export interface Opening {
  id: number;
  job_title: string;
  department: string | null;
  role: string | null;
  qualification_required: string | null;
  required_experience: number | null;
  responsibilities: string | null;
  skills_required: string | null;
  location: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OpeningCreatePayload {
  job_title: string;
  department?: string | null;
  role?: string | null;
  qualification_required?: string | null;
  required_experience?: number | null;
  responsibilities?: string | null;
  skills_required?: string | null;
  location?: string | null;
}

export interface OpeningUpdatePayload extends OpeningCreatePayload {
  status: string;
}

export interface OpeningListResponse {
  openings: Opening[];
  total: number;
}

export interface ChoiceItem {
  value: string;
  label: string;
}

export interface FormChoicesResponse {
  departments: ChoiceItem[];
  designations: ChoiceItem[];
}
