import { useState } from 'react';
import axios from 'axios';

export const useChatWithPsychologist = (psychologistId: string) => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startChat = async (initialMessage?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        'http://127.0.0.1:8000/api/chat/conversations/',
        {
          psychologist_id: psychologistId,
          initial_message: initialMessage
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setConversationId(response.data.id);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Error al iniciar chat';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    conversationId,
    isLoading,
    error,
    startChat
  };
};