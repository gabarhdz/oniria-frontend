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
 * Procesa diferentes formatos de imagen
 */
const processImageData = (imageData?: string | null): string | null => {
  if (!imageData) {
    console.log('⚠️ No image data provided');
    return null;
  }
  
  const trimmed = imageData.trim();
  console.log('🔍 Processing image data:', {
    length: trimmed.length,
    startsWithData: trimmed.startsWith('data:image'),
    startsWithHttp: trimmed.startsWith('http'),
    startsWithSlash: trimmed.startsWith('/'),
    first100: trimmed.substring(0, 100)
  });
  
  // Ya es una data URL completa
  if (trimmed.startsWith('data:image')) {
    console.log('✅ Image is already a data URL');
    return trimmed;
  }
  
  // Es una URL HTTP completa
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    console.log('✅ Image is an HTTP URL');
    return trimmed;
  }
  
  // Es una ruta relativa del servidor
  if (trimmed.startsWith('/media/') || trimmed.startsWith('/')) {
    const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
    const fullUrl = `${API_BASE}${trimmed}`;
    console.log('✅ Image is a relative path, converting to:', fullUrl);
    return fullUrl;
  }
  
  // Es base64 puro sin prefijo
  const base64Pattern = /^[A-Za-z0-9+/=]+$/;
  if (base64Pattern.test(trimmed) && trimmed.length > 50) {
    const dataUrl = `data:image/jpeg;base64,${trimmed}`;
    console.log('✅ Image is raw base64, adding prefix');
    return dataUrl;
  }
  
  console.error('❌ Unrecognized image format:', trimmed.substring(0, 100));
  return null;
};

/**
 * Crea un SVG con las iniciales como fallback
 */
const createInitialsSvg = (initials: string = 'NA'): string => {
  const text = initials.slice(0, 2).toUpperCase();
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'>
      <defs>
        <linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' style='stop-color:#9675bc;stop-opacity:1' />
          <stop offset='50%' style='stop-color:#f1b3be;stop-opacity:1' />
          <stop offset='100%' style='stop-color:#ffe0db;stop-opacity:1' />
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#grad)' rx='20' ry='20'/>
      <text 
        x='50%' 
        y='50%' 
        dy='.1em' 
        fill='#fff' 
        font-family='Helvetica, Arial, sans-serif' 
        font-size='56' 
        font-weight='700' 
        text-anchor='middle'
        dominant-baseline='middle'
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
    let imgElement: HTMLImageElement | null = null;
    
    setIsLoading(true);
    setHasError(false);

    const loadImage = async () => {
      try {
        // Si no hay imagen, usar initials
        if (!imageData) {
          console.log('ℹ️ No image data, using initials SVG');
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
          imgElement = new Image();
          
          const loadPromise = new Promise<void>((resolve, reject) => {
            if (!imgElement) {
              reject(new Error('Image element is null'));
              return;
            }
            
            imgElement.onload = () => {
              console.log('✅ Image loaded successfully');
              resolve();
            };
            
            imgElement.onerror = (e) => {
              console.error('❌ Error loading image:', e);
              console.error('Failed URL:', processedUrl.substring(0, 150));
              reject(new Error('Failed to load image'));
            };
            
            // Importante: establecer src DESPUÉS de definir los handlers
            imgElement.src = processedUrl;
          });
          
          // Timeout de 10 segundos para cargar la imagen
          const timeoutPromise = new Promise<void>((_, reject) => {
            setTimeout(() => reject(new Error('Image load timeout')), 10000);
          });
          
          await Promise.race([loadPromise, timeoutPromise]);
          
          if (mounted) {
            setImageUrl(processedUrl);
            setIsLoading(false);
          }
        } else {
          // Si no se pudo procesar, usar initials
          console.log('⚠️ Could not process image, using initials SVG');
          if (mounted) {
            setImageUrl(createInitialsSvg(options.fallbackInitials));
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('❌ Error in useBase64Image:', error);
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
      if (imgElement) {
        imgElement.onload = null;
        imgElement.onerror = null;
        imgElement = null;
      }
    };
  }, [imageData, options.fallbackInitials]);

  const resetError = () => setHasError(false);

  return { imageUrl, hasError, isLoading, resetError };
};

export default useBase64Image;