// src/hooks/useBase64Image.ts
import { useState, useEffect } from 'react';

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
 * Procesa diferentes formatos de imagen y los convierte a data URL
 */
const processImageData = (imageData?: string | null): string | null => {
  if (!imageData) return null;
  
  const trimmed = imageData.trim();
  
  // Ya es una data URL completa
  if (trimmed.startsWith('data:image')) {
    return trimmed;
  }
  
  // Es una URL HTTP completa
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  // Es una ruta relativa del servidor
  if (trimmed.startsWith('/media/') || trimmed.startsWith('/')) {
    const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
    return `${API_BASE}${trimmed}`;
  }
  
  // Es base64 puro sin prefijo
  // Validar que sea base64 válido (caracteres permitidos + longitud mínima)
  const base64Pattern = /^[A-Za-z0-9+/=]+$/;
  if (base64Pattern.test(trimmed) && trimmed.length > 50) {
    // Asumir JPEG por defecto
    return `data:image/jpeg;base64,${trimmed}`;
  }
  
  console.warn('Formato de imagen no reconocido:', trimmed.substring(0, 100));
  return null;
};

/**
 * Crea un SVG con las iniciales como fallback
 */
const createInitialsSvg = (initials: string = 'NA'): string => {
  const text = initials.slice(0, 2).toUpperCase();
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'>
      <rect width='100%' height='100%' fill='#9675bc' rx='20' ry='20'/>
      <text 
        x='50%' 
        y='50%' 
        dy='.1em' 
        fill='#fff' 
        font-family='Helvetica, Arial, sans-serif' 
        font-size='56' 
        font-weight='700' 
        text-anchor='middle'
      >${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

/**
 * Hook para manejar imágenes en base64 y otros formatos
 */
export const useBase64Image = (
  imageData?: string | null,
  options: UseBase64ImageOptions = {}
): UseBase64ImageReturn => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setHasError(false);

    const loadImage = async () => {
      try {
        // Si no hay imagen, usar initials
        if (!imageData) {
          if (mounted) {
            setImageUrl(createInitialsSvg(options.fallbackInitials));
            setIsLoading(false);
          }
          return;
        }

        // Procesar la imagen
        const processedUrl = processImageData(imageData);
        
        if (processedUrl) {
          // Validar que la imagen se puede cargar
          const img = new Image();
          
          img.onload = () => {
            if (mounted) {
              setImageUrl(processedUrl);
              setIsLoading(false);
            }
          };
          
          img.onerror = () => {
            console.error('Error loading image:', processedUrl.substring(0, 100));
            if (mounted) {
              setHasError(true);
              setImageUrl(createInitialsSvg(options.fallbackInitials));
              setIsLoading(false);
              options.onError?.();
            }
          };
          
          img.src = processedUrl;
        } else {
          // Si no se pudo procesar, usar initials
          if (mounted) {
            setImageUrl(createInitialsSvg(options.fallbackInitials));
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error in useBase64Image:', error);
        if (mounted) {
          setHasError(true);
          setImageUrl(createInitialsSvg(options.fallbackInitials));
          setIsLoading(false);
          options.onError?.();
        }
      }
    };

    loadImage();

    return () => {
      mounted = false;
    };
  }, [imageData, options.fallbackInitials]);

  const resetError = () => setHasError(false);

  return { imageUrl, hasError, isLoading, resetError };
};

export default useBase64Image;