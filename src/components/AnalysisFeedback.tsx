import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface AnalysisFeedbackProps {
  isAnalyzing: boolean;
  progress: number;
  message: string;
}

export function AnalysisFeedback({
  isAnalyzing,
  progress,
  message,
}: AnalysisFeedbackProps) {
  if (!isAnalyzing) return null;

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-card p-8 rounded-2xl shadow-xl border w-full max-w-md text-center space-y-4">
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            y: [0, -8, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut',
          }}
        >
          {/* Brilho pulsante ao redor */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/30 blur-xl"
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: 'easeInOut',
            }}
          />

          {/* Ícone principal */}
          <motion.div
            animate={{
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: 'easeInOut',
            }}
          >
            <Brain className="h-10 w-10 text-primary drop-shadow-lg" />
          </motion.div>
        </motion.div>

        <p className="text-lg font-semibold text-foreground">{message}</p>

        <Progress value={progress} className="w-full" />

        <p className="text-xs text-muted-foreground">
          Isso pode levar alguns segundos dependendo do número de artigos.
        </p>
      </div>
    </motion.div>
  );
}
