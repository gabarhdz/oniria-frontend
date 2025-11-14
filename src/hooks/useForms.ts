// src/hooks/useForms.ts - VERSIÓN CORREGIDA
import { useState, useCallback } from 'react';
import axios from 'axios';
import type {
  Question,
  Form,
  FormResponse,
  DueTest,
  CreateQuestionData,
  CreateFormData,
  AssignTestData,
  SubmitFormData
} from '../types/forms';

const API_BASE = 'http://127.0.0.1:8000/api/psychologists';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  'Content-Type': 'application/json'
});

export const useForms = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==================== QUESTIONS ====================
  
  const createQuestion = useCallback(async (data: CreateQuestionData): Promise<Question> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE}/questions/`, data, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al crear pregunta';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getQuestions = useCallback(async (): Promise<Question[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/questions/`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al obtener preguntas';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateQuestion = useCallback(async (id: string, data: Partial<CreateQuestionData>): Promise<Question> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_BASE}/questions/${id}/`, data, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al actualizar pregunta';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteQuestion = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE}/questions/${id}/`, {
        headers: getAuthHeaders()
      });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al eliminar pregunta';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ==================== FORMS ====================

  const createForm = useCallback(async (data: CreateFormData): Promise<Form> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE}/forms/`, data, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al crear formulario';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getForms = useCallback(async (): Promise<Form[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/forms/`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al obtener formularios';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getForm = useCallback(async (id: string): Promise<Form> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/forms/${id}/`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al obtener formulario';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateForm = useCallback(async (id: string, data: Partial<CreateFormData>): Promise<Form> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_BASE}/forms/${id}/`, data, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al actualizar formulario';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteForm = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE}/forms/${id}/`, {
        headers: getAuthHeaders()
      });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al eliminar formulario';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ==================== DUE TESTS (Asignaciones) ====================

  const assignTest = useCallback(async (data: AssignTestData): Promise<DueTest> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE}/assign-due-tests/`, data, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al asignar test';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔹 CORRECCIÓN: Endpoint separado para psicólogos y pacientes
  const getAssignedTests = useCallback(async (): Promise<DueTest[]> => {
    setIsLoading(true);
    setError(null);
    try {
      // Este endpoint devuelve los tests que el PSICÓLOGO ha asignado
      const response = await axios.get(`${API_BASE}/assign-due-tests/`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al obtener tests asignados';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔹 NUEVO: Endpoint para que PACIENTES vean sus tests pendientes
  const getMyDueTests = useCallback(async (): Promise<DueTest[]> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔍 Llamando a /my-due-tests/');
      const response = await axios.get(`${API_BASE}/my-due-tests/`, {
        headers: getAuthHeaders()
      });
      console.log('✅ Respuesta recibida:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('❌ Error en getMyDueTests:', err.response?.data || err);
      const message = err.response?.data?.error || 'Error al obtener tus tests pendientes';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDueTest = useCallback(async (id: string): Promise<DueTest> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/due-tests/${id}/`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al obtener test';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ==================== RESPONSES ====================

  const submitFormResponse = useCallback(
    async (data: SubmitFormData): Promise<FormResponse> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${API_BASE}/form-response/`, data, {
          headers: getAuthHeaders()
        });
        return response.data;
      } catch (err: any) {
        const message = err.response?.data?.error || 'Error al enviar respuestas';
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getFormResponses = useCallback(async (): Promise<FormResponse[]> => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await axios.get(`${API_BASE}/my-form-responses/`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (err: any) {
    const message = err.response?.data?.error || 'Error al obtener respuestas';
    setError(message);
    throw new Error(message);
  } finally {
    setIsLoading(false);
  }
}, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    clearError,
    // Questions
    createQuestion,
    getQuestions,
    updateQuestion,
    deleteQuestion,
    // Forms
    createForm,
    getForms,
    getForm,
    updateForm,
    deleteForm,
    // Assignments
    assignTest,
    getAssignedTests,  // Para psicólogos
    getMyDueTests,     // 🔹 NUEVO: Para pacientes
    getDueTest,
    // Responses
    submitFormResponse,
    getFormResponses,
    
  };
};