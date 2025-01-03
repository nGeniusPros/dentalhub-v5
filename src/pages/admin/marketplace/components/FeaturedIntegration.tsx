import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import type { Integration } from '../types';

interface FeaturedIntegrationProps {
  integration: Integration;
}

export const FeaturedIntegration: React.FC<FeaturedIntegrationProps> = ({ integration }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-navy via-purple to-turquoise text-white rounded-xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              {integration.icon ? (
                <img
                  src={integration.icon}
                  alt={integration.name}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <Icons.Box className="w-10 h-10" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{integration.name}</h2>
                <span className="px-3 py-1 text-xs font-medium bg-white/10 backdrop-blur-sm rounded-full">
                  Featured
                </span>
              </div>
              <p className="text-lg text-white/80 mb-4">{integration.description}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Icons.Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{integration.rating}</span>
                </div>
                <span className="text-white/60">|</span>
                <span className="text-white/80">{integration.reviews} reviews</span>
                <span className="text-white/60">|</span>
                <span className="text-white/80">{integration.pricing}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-lg font-semibold mb-1">{integration.pricing}</span>
            <Button className="bg-white text-navy hover:bg-white/90">
              Start Free Trial
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {integration.features.map((feature, index) => (
            <div
              key={index}
              className="px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg flex items-center gap-3"
            >
              <Icons.Check className="w-4 h-4" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Why Choose Weave?</h3>
          <p className="text-white/80">
            Weave unifies your practice's phone system, patient communication, and payments 
            into one powerful platform. Streamline operations, boost patient engagement, 
            and grow your practice with smart automation and integrated tools.
          </p>
        </div>
      </div>
    </motion.div>
  );
};