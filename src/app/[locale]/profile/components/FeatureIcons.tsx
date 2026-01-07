"use client";
import { LucideIcon } from "lucide-react";

export interface FeatureIcon {
  icon: LucideIcon;
  label: string;
  color: string;
  badge?: string;
}

interface FeatureIconsProps {
  features: FeatureIcon[];
  onFeatureClick?: (index: number) => void;
}

export default function FeatureIcons({ features, onFeatureClick }: FeatureIconsProps) {
  return (
    <div className="px-4 mb-4">
      <div className="grid grid-cols-5 gap-4">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <button
              key={index}
              className="flex flex-col items-center"
              onClick={() => onFeatureClick?.(index)}
            >
              <div className={`w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-2 relative ${feature.color}`}>
                <IconComponent className="h-6 w-6" />
                {feature.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded">
                    {feature.badge}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-700 text-center">{feature.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

