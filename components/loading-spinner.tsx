'use client';

import { cn } from '@/lib/utils';
import { motion } from "framer-motion";

/**
 * Спинер загрузки для отображения при загрузке компонентов
 */
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <motion.div
        className="space-y-4 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        <div className="inline-flex rounded-full border border-line/80 bg-white/5 p-4">
          <motion.div
            className="h-8 w-8 rounded-full border-4 border-accent/15 border-t-accent animate-spin"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        </div>
        <motion.p
          className="text-muted text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Загрузка...
        </motion.p>
      </motion.div>
    </div>
  );
}
