import { Star } from 'lucide-react';

const BackgroundDecorations: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => {
        const size = i * 15 + 100;
        const left = (i * 4.5) % 100;
        const top = (i * 7.3) % 100;
        const delay = i * 0.5;
        const duration = i + 20;
        
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white/5 animate-float blur-sm"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
      {[...Array(15)].map((_, i) => {
        const size = (i % 3) + 4;
        const left = (i * 6.7) % 100;
        const top = (i * 8.2) % 100;
        const delay = i * 0.2;
        
        return (
          <Star
            key={`star-${i}`}
            className="absolute text-oniria_lightpink/20 animate-pulse"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}; 
export default BackgroundDecorations;