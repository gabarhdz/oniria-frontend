// src/types/forms.ts

export interface Question {
  id: string;
  psychologist: string;
  question_text: string;
  min_value: number;
  max_value: number;
}

export interface Form {
  id: string;
  psychologist: {
    id: string;
    username: string;
    profile_pic?: string;
  };
  title: string;
  description?: string;
  questions: Question[];
  questions_ids?: string[];
}

export interface Answer {
  id: string;
  question: string;
  value: number;
}

export interface FormResponse {
  id: string;
  form: Form;
  user: {
    id: string;
    username: string;
    profile_pic?: string;
  };
  created_at: string;
  total_score: number;
  answers: Answer[];
  due_test?: {
    id: string;
    description?: string;
    date: string;
  };
}

export interface DueTest {
  id: string;
  psychologist: {
    id: string;
    username: string;
  };
  patient: {
    id: string;
    username: string;
    email: string;
  };
  form: Form;
  date: string;
  description?: string;
  is_completed: boolean;
  access_code: number;
}

export interface CreateQuestionData {
  question_text: string;
  min_value: number;
  max_value: number;
}

export interface CreateFormData {
  title: string;
  description?: string;
  questions_ids: string[];
}

export interface AssignTestData {
  form: string;        // UUID del formulario
  patient: string;     // UUID del paciente
  date: string;        // ISO string de la fecha
  description?: string; // Descripción opcional
}

export interface SubmitFormData {
  form: string;
  answers: {
    question: string;
    value: number;
  }[];
}