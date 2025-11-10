// src/hooks/useBase64Image.ts
import { useState, useEffect } from 'react';

declare const process: {
  env: {
    REACT_APP_API_URL?: string;
  };
};

interface UseBase64ImageOptions {
  fallbackInitials?: string;
  onError?: () => void;
}

interface UseBase64ImageReturn {
  imageUrl: string | null;
  hasError: boolean;
  isLoading: boolean;
  resetError: () => void;
}

/**
 * Hook personalizado para manejar imágenes en base64
 * Convierte automáticamente base64 a formato data:image si es necesario
 * 
 * @param imageData - String que puede ser base64, URL o path
 * @param options - Opciones adicionales para el hook
 * @returns Objeto con imageUrl procesada, estados de error y carga
 */
export const useBase64Image = (
  imageData?: string | null,
  options: UseBase64ImageOptions = {}
): UseBase64ImageReturn => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    if (!imageData) {
      setImageUrl(null);
      setIsLoading(false);
      return;
    }

    try {
      let processedUrl: string | null = null;

      // 1. Si ya tiene prefijo data:image, usar directamente
      if (imageData.startsWith('data:image')) {
        processedUrl = imageData;
      }
      // 2. Si es base64 puro (típicamente muy largo y sin caracteres de URL)
      else if (imageData.length > 100 && !imageData.includes('/') && !imageData.includes('http')) {
        // Determinar el tipo de imagen si es posible
        const imageType = 'jpeg'; // Por defecto JPEG
        processedUrl = `data:image/${imageType};base64,${imageData}`;
      }
      // 3. Si es URL HTTP/HTTPS completa
      else if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
        processedUrl = imageData;
      }
      // 4. Si es path relativo del servidor
      else if (imageData.startsWith('/')) {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
        processedUrl = `${apiUrl}${imageData}`;
      }
      // 5. Cualquier otro caso, intentar como base64
      else if (imageData.length > 50) {
        processedUrl = `data:image/jpeg;base64,${imageData}`;
      }

      setImageUrl(processedUrl);
    } catch (error) {
      console.error('Error processing image:', error);
      setHasError(true);
      if (options.onError) {
        options.onError();
      }
    } finally {
      setIsLoading(false);
    }
  }, [imageData, options]);

  const resetError = () => {
    setHasError(false);
  };

  return {
    imageUrl,
    hasError,
    isLoading,
    resetError
  };
};

/**
 * Utilidad para verificar si una string es base64 válido
 */
export const isValidBase64 = (str: string): boolean => {
  if (!str || str.length === 0) return false;
  
  // Si tiene prefijo data:image, extraer solo el base64
  const base64Data = str.includes(',') ? str.split(',')[1] : str;
  
  try {
    return btoa(atob(base64Data)) === base64Data;
  } catch (err) {
    return false;
  }
};

/**
 * Utilidad para obtener el tipo MIME de una imagen base64
 */
export const getBase64MimeType = (base64: string): string | null => {
  if (!base64.startsWith('data:')) return null;
  
  const matches = base64.match(/data:([^;]+);/);
  return matches ? matches[1] : null;
};

/**
 * Utilidad para convertir un File/Blob a base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Utilidad para validar el tamaño de una imagen base64
 */
export const getBase64Size = (base64: string): number => {
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
  const padding = base64Data.endsWith('==') ? 2 : base64Data.endsWith('=') ? 1 : 0;
  return (base64Data.length * 0.75) - padding;
};

export default useBase64Image;