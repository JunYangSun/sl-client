"use client";

import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface MembershipTier {
  name: string;
  threshold: number; // 积分阈值
  isActive: boolean;
}

export interface MembershipCardProps {
  points: number;
  maxPoints: number;
  tiers: MembershipTier[];
  onViewBenefits?: () => void;
}

/**
 * 会员卡片组件
 * 显示会员等级、积分进度和会员权益
 */
export default function MembershipCard({
  points,
  maxPoints,
  tiers,
  onViewBenefits,
}: MembershipCardProps) {
  // 计算进度百分比
  const progressPercentage = (points / maxPoints) * 100;
  
  // 根据当前积分自动判断当前等级
  const getCurrentTier = () => {
    // 从高到低检查，找到当前积分达到的最高等级
    const sortedTiers = [...tiers].sort((a, b) => b.threshold - a.threshold);
    for (const tier of sortedTiers) {
      if (points >= tier.threshold) {
        return tier.name;
      }
    }
    return sortedTiers[sortedTiers.length - 1]?.name || tiers[0]?.name;
  };

  // 更新等级激活状态
  const updatedTiers = tiers.map(tier => ({
    ...tier,
    isActive: points >= tier.threshold,
  }));

  // 获取当前等级名称
  const currentTierName = getCurrentTier();

  // 计算节点位置（百分比）
  const getNodePosition = (threshold: number, index: number, total: number) => {
    const percentage = (threshold / maxPoints) * 100;
    // 如果是最后一个节点，确保不超出进度条
    if (index === total - 1) {
      return 100; // 最后一个节点固定在100%位置
    }
    return percentage;
  };

  return (
    <div className="px-4 mb-4">
      {/* bg-gradient-to-br */}
      <Card className=" from-purple-500 via-pink-500 to-orange-400 rounded-[20px] p-6 text-white relative overflow-hidden shadow-2xl">
        {/* 背景装饰光效 */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 via-transparent to-yellow-400/30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl" />
        
        {/* Logo装饰 */}
        <div className="absolute top-4 right-3 w-12 h-12 border-2 border-white/40 rounded-lg flex items-center justify-center backdrop-blur-md bg-white/10 shadow-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white text-xs font-bold">Hi</span>
          </div>
        </div>

        {/* 会员等级标签 */}
        <div className="inline-block bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-3 border border-white/30 shadow-lg">
          <span className="text-sm font-bold text-white drop-shadow-md">{currentTierName}会员</span>
        </div>

        {/* 进度信息 */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            {/* 积分进度 */}
            <div className="text-3xl font-black mb-2 drop-shadow-lg bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
              {points}/{maxPoints}
            </div>
            {/* 查看会员权益链接 */}
            <div className="flex justify-end">
              <button
                onClick={onViewBenefits}
                className="text-sm font-semibold text-white/95 hover:text-yellow-200 flex items-center gap-1 transition-all hover:scale-105 drop-shadow-md"
              >
                查看会员权益 <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 进度条（带节点） */}
          <div className="relative w-full pt-2 pb-6">
            {/* 背景进度条 */}
            <div className="w-full h-3 bg-white/25 rounded-full overflow-hidden relative backdrop-blur-sm shadow-inner">
              {/* 进度填充 */}
              <div 
                className="h-full bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-400 rounded-full transition-all duration-300 shadow-lg relative overflow-hidden"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              >
                {/* 进度条光泽效果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
            
            {/* 等级节点标记（放在进度条外部，避免被overflow隐藏） */}
            {updatedTiers.map((tier, index) => {
              const nodePosition = getNodePosition(tier.threshold, index, updatedTiers.length);
              const isReached = points >= tier.threshold;
              const isCurrent = tier.name === currentTierName;
              const isLast = index === updatedTiers.length - 1;
              const isFirst = index === 0;
              
              return (
                <div
                  key={index}
                  className="absolute top-1/3 -translate-y-1/2 z-10 flex flex-col items-center"
                  style={{ 
                    left: isLast 
                      ? 'calc(100% - 12px)' // 最后一个节点：右对齐，减去节点半径（3px * 2 = 6px）
                      : `calc(${nodePosition}% - 6px)` // 其他节点：使用百分比位置，减去节点半径以居中
                  }}
                >
                  {/* 节点圆点 */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      isReached
                        ? isCurrent
                          ? "bg-gradient-to-br from-yellow-300 to-pink-400 border-white scale-125 shadow-xl -translate-x-[-7px] -translate-y-[1px] ring-4 ring-yellow-300/50"
                          : "bg-gradient-to-br from-white to-pink-200 border-white/80 shadow-md"
                        : "bg-white/40 border-white/50"
                    }`}
                  />
                  {/* 节点标签（显示在节点下方） */}
                  <div 
                    className={`absolute top-7 whitespace-nowrap ${
                      isFirst 
                        ? 'left-[5px]' // 第一个节点：左对齐
                        : isLast 
                        ? 'right-0' // 最后一个节点：右对齐
                        : 'left-1/2 -translate-x-1/2' // 其他节点：居中对齐
                    }`}
                  >
                    <span
                      className={`text-[12px] font-bold text-white drop-shadow-lg transition-all ${
                        isCurrent
                          ? "font-black scale-110 bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent"
                          : isReached
                          ? "opacity-100"
                          : "opacity-75"
                      }`}
                    >
                      {tier.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
      
      {/* 添加光泽动画样式 */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
