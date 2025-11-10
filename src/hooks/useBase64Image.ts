// ...existing code...
import { useState, useEffect } from 'react';

declare const process: {
  env: {
    REACT_APP_API_URL?: string;
  };
};

interface UseBase64ImageOptions {
  fallbackInitials?: string;
  onError?: () => void;
  svgSize?: number;
  apiBaseUrl?: string;
}

interface UseBase64ImageReturn {
  imageUrl: string | null;
  hasError: boolean;
  isLoading: boolean;
  resetError: () => void;
}

/* Helpers */
const isDataImage = (s: string) => /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(s.trim());
const isHttpUrl = (s: string) => /^https?:\/\//i.test(s.trim());

export const toDataImage = (imageData?: string | null, defaultMime = 'jpeg', apiBase?: string) => {
  if (!imageData) return null;
  const trimmed = imageData.trim();

  // Already a data URL
  if (isDataImage(trimmed)) return trimmed;

  // Full HTTP URL
  if (isHttpUrl(trimmed)) return trimmed;

  // If looks like '/path/to/file' or 'media/..' -> prefix API base
  if (trimmed.startsWith('/')) {
    const base = apiBase ?? process.env.REACT_APP_API_URL ?? 'http://127.0.0.1:8000';
    return `${base}${trimmed}`;
  }
  if (/^(media|uploads)\/.+/.test(trimmed)) {
    const base = apiBase ?? process.env.REACT_APP_API_URL ?? 'http://127.0.0.1:8000';
    return `${base}/${trimmed}`;
  }

  // Pure base64 payload without data: prefix -> add default mime
  // Validate basic base64 chars
  const candidate = trimmed.replace(/\s+/g, '');
  if (/^[A-Za-z0-9+/=]+$/.test(candidate) && candidate.length > 50) {
    return `data:image/${defaultMime};base64,${candidate}`;
  }

  // Fallback: return null
  return null;
};

const createInitialsSvgDataUrl = (initials: string | undefined, size = 128) => {
  const txt = (initials || 'NA').slice(0, 2).toUpperCase();
  const bg = '#9675bc';
  const fg = '#fff';
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>
    <rect width='100%' height='100%' fill='${bg}' rx='20' ry='20'/>
    <text x='50%' y='50%' dy='.1em' fill='${fg}' font-family='Helvetica, Arial, sans-serif' font-size='${Math.round(size *
    0.44)}' font-weight='700' text-anchor='middle'>${txt}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const useBase64Image = (
  imageData?: string | null,
  options: UseBase64ImageOptions = {}
): UseBase64ImageReturn => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const apiBase = options.apiBaseUrl || process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
  const svgSize = options.svgSize ?? 128;

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setHasError(false);

    (async () => {
      try {
        if (!imageData) {
          if (mounted) setImageUrl(createInitialsSvgDataUrl(options.fallbackInitials, svgSize));
          return;
        }

        const processed = toDataImage(imageData, 'jpeg', apiBase);
        if (mounted && processed) {
          setImageUrl(processed);
          return;
        }

        // fallback initials
        if (mounted) setImageUrl(createInitialsSvgDataUrl(options.fallbackInitials, svgSize));
      } catch (err) {
        console.error('useBase64Image error:', err);
        if (mounted) {
          setHasError(true);
          setImageUrl(createInitialsSvgDataUrl(options.fallbackInitials, svgSize));
        }
        options.onError?.();
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [imageData, options.fallbackInitials, options.svgSize, options.apiBaseUrl]);

  const resetError = () => setHasError(false);

  return { imageUrl, hasError, isLoading, resetError };
};

export default useBase64Image;
// ...existing code...