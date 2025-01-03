import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import type { GameElement } from '../../types/learning';

interface GameElementsProps {
  elements: GameElement[];
  onUnlock?: (elementId: string) => void;
}

export const GameElements: React.FC<GameElementsProps> = ({
  elements,
  onUnlock
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "bg-white rounded-xl shadow-lg border p-6",
            element.unlocked ? "border-primary/20" : "border-gray-200"
          )}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={cn(
              "p-3 rounded-xl",
              element.unlocked ? "bg-primary/10" : "bg-gray-100"
            )}>
              {React.createElement(Icons[element.icon as keyof typeof Icons], {
                className: cn(
                  "w-6 h-6",
                  element.unlocked ? "text-primary" : "text-gray-400"
                )
              })}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{element.name}</h3>
              <p className="text-sm text-gray-500">{element.type}</p>
            </div>
          </div>

          <p className="text-gray-600 mb-4">{element.description}</p>

          {element.unlocked ? (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Icons.CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-600">Unlocked</span>
              </div>
              {element.unlockedAt && (
                <span className="text-gray-500">
                  {new Date(element.unlockedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={() => onUnlock?.(element.id)}
            >
              <Icons.Lock className="w-4 h-4 mr-2" />
              Unlock
            </Button>
          )}
        </motion.div>
      ))}
    </div>
  );
};