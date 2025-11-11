// src/hooks/useChatWithPsychologist.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';

interface UseChatWithPsychologistReturn {
  conversationId: string | null;
  isLoading: boolean;
  error: string | null;
  startChat: (initialMessage?: string) => Promise<any>;
  clearError: () => void;
}

/**
 * Hook para gestionar el chat con un psicólogo
 * Incluye verificación de conversación existente y creación de nueva
 */
export const useChatWithPsychologist = (
  psychologistId: string
): UseChatWithPsychologistReturn => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const checkingRef = useRef(false);

  // Verificar si ya existe una conversación con este psicólogo
  const checkExistingConversation = useCallback(async (): Promise<string | null> => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No estás autenticado');
      }

      const response = await axios.get(
        'http://127.0.0.1:8000/api/chat/conversations/',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Buscar conversación existente con este psicólogo
      const existingConversation = response.data.find((conv: any) => 
        conv.psychologist.id === psychologistId || conv.user.id === psychologistId
      );

      if (existingConversation) {
        console.log('✅ Found existing conversation:', existingConversation.id);
        return existingConversation.id;
      }

      return null;
    } catch (err) {
      console.error('Error checking existing conversation:', err);
      return null;
    }
  }, [psychologistId]);

  // Inicializar el chat (verificar existente o crear nuevo)
  const startChat = useCallback(async (initialMessage?: string) => {
    if (checkingRef.current) {
      console.log('⚠️ Already checking/starting chat...');
      return;
    }

    checkingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // Primero verificar si ya existe una conversación
      const existingId = await checkExistingConversation();
      
      if (existingId) {
        setConversationId(existingId);
        checkingRef.current = false;
        setIsLoading(false);
        return { id: existingId, isNew: false };
      }

      // Si no existe, crear nueva conversación
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No estás autenticado');
      }

      console.log('📝 Creating new conversation with psychologist:', psychologistId);

      const response = await axios.post(
        'http://127.0.0.1:8000/api/chat/conversations/',
        {
          psychologist_id: psychologistId,
          initial_message: initialMessage || '¡Hola! Me gustaría consultar contigo.'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ New conversation created:', response.data.id);

      setConversationId(response.data.id);
      checkingRef.current = false;
      setIsLoading(false);
      return { ...response.data, isNew: true };

    } catch (err: any) {
      console.error('❌ Error starting chat:', err);
      
      let errorMsg = 'Error al iniciar el chat';
      
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          errorMsg = 'Sesión expirada. Por favor inicia sesión nuevamente.';
        } else if (err.response?.status === 403) {
          errorMsg = 'No tienes permiso para iniciar este chat.';
        } else if (err.response?.status === 404) {
          errorMsg = 'Psicólogo no encontrado.';
        } else if (err.response?.data?.error) {
          errorMsg = err.response.data.error;
        } else if (err.response?.data?.message) {
          errorMsg = err.response.data.message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      checkingRef.current = false;
      setIsLoading(false);
      throw new Error(errorMsg);
    }
  }, [psychologistId, checkExistingConversation]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Verificar conversación existente al montar el componente
  useEffect(() => {
    const checkOnMount = async () => {
      const existingId = await checkExistingConversation();
      if (existingId) {
        setConversationId(existingId);
      }
    };

    checkOnMount();
  }, [checkExistingConversation]);

  return {
    conversationId,
    isLoading,
    error,
    startChat,
    clearError
  };
};

export default useChatWithPsychologist;