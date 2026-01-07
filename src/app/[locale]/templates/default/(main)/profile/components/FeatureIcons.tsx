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
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2 relative">
                <IconComponent className={`h-6 w-6 ${feature.color}`} />
                {feature.badge && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] px-1 rounded">
                    {feature.badge}
                  </span>
                )}
              </div>
              <span className="text-xs text-foreground text-center">{feature.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

