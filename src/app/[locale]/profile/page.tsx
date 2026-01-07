"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { 
  Gift,
  Receipt,
  IdCard,
  Star,
  Shirt,
  HelpCircle,
  MessageCircle,
  WalletIcon,
  UserRoundPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MembershipCard from "./components/MembershipCard";
import type { MembershipTier } from "./components/MembershipCard";
import UserInfo from "./components/UserInfo";
import AccountOverview from "./components/AccountOverview";
import AnnouncementBar from "./components/AnnouncementBar";
import FeatureIcons, { type FeatureIcon } from "./components/FeatureIcons";
import type { MenuItem } from "./components/MenuList";

// 动态导入 MenuList 组件，只在客户端加载以避免 hydration 错误
const MenuList = dynamic(() => import("./components/MenuList"), {
  ssr: false,
  loading: () => (
    <div className="px-4">
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  ),
});

export default function ProfilePage() {
  // 模拟用户数据
  const [userInfo] = useState({
    name: "熵联2026",
    email:"shanglian2026@email.com",
    avatar: "",
    membershipLevel: "商联会员",
    points: 353,
    maxPoints: 2000,
    coupons: 2,
    laobi: 79,
    cardPack: 100,
    onlineCard: 353,
    isVerified: false,
  });

  // 会员等级列表（带积分阈值）
  const membershipTiers: MembershipTier[] = [
    { name: "红海", threshold: 0, isActive: true },
    { name: "银海", threshold: 400, isActive: false },
    { name: "金海", threshold: 1000, isActive: false },
    { name: "黑海", threshold: 2000, isActive: false },
  ];

  // 功能图标配置
  const featureIcons: FeatureIcon[] = [
    { icon: WalletIcon, label: "钱包", color: "text-red-500" },
    { icon: Gift, label: "线下活动", color: "text-red-500" },
    { icon: Receipt, label: "发票中心", color: "text-green-500" },
    { icon: UserRoundPlus, label: "邀请码", color: "text-red-500" },
    { icon: IdCard, label: "实名认证", color: "text-yellow-500", badge: !userInfo.isVerified ? "未实名" : undefined },
  ];

  // 设置菜单项
  const menuItems: MenuItem[] = [
    {
      icon: Star,
      label: "会员须知",
      color: "text-red-500",
      content: (
        <div className="flex flex-col gap-4 text-balance">
          <p>
            Our flagship product combines cutting-edge technology with sleek
            design. Built with premium materials, it offers unparalleled
            performance and reliability.
          </p>
          <p>
            Key features include advanced processing capabilities, and an
            intuitive user interface designed for both beginners and
            experts.
          </p>
        </div>
      ),
    },
    {
      icon: Shirt,
      label: "装扮中心",
      color: "text-red-500",
      content: (
        <div className="space-y-2 text-sm text-gray-600">
          <p className="font-medium text-gray-900">个性化装扮</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xs">头像框</span>
            </div>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xs">背景</span>
            </div>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xs">徽章</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            使用积分兑换装扮道具，展示个性风采
          </p>
        </div>
      ),
    },
    {
      icon: HelpCircle,
      label: "常见问题",
      color: "text-red-500",
      content: (
        <div className="space-y-3 text-sm text-gray-600">
          <div>
            <p className="font-medium text-gray-900 mb-1">Q: 如何升级会员等级？</p>
            <p className="text-xs">A: 通过消费累积积分，达到相应积分阈值即可自动升级。</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">Q: 积分如何获得？</p>
            <p className="text-xs">A: 每次消费均可获得积分，具体规则请查看积分说明。</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">Q: 积分会过期吗？</p>
            <p className="text-xs">A: 积分有效期为一年，请在有效期内使用。</p>
          </div>
        </div>
      ),
    },
    {
      icon: MessageCircle,
      label: "帮助中心",
      color: "text-red-500",
      content: (
        <div className="space-y-2 text-sm text-gray-600">
          <p className="font-medium text-gray-900">联系我们</p>
          <div className="space-y-1 text-xs">
            <p>客服热线：400-123-4567</p>
            <p>在线客服：工作日 9:00-18:00</p>
            <p>邮箱：support@example.com</p>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <button className="text-red-500 text-xs font-medium hover:underline">
              在线咨询
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 用户资料区域 */}
      <UserInfo 
        name={userInfo.name}
        email={userInfo.email}
        avatar={userInfo.avatar}
      />

      {/* 会员卡片 */}
      <MembershipCard
        points={userInfo.points}
        maxPoints={userInfo.maxPoints}
        tiers={membershipTiers}
        onViewBenefits={() => {
          // TODO: 实现查看会员权益的逻辑
          console.log("查看会员权益");
        }}
      />

      {/* 账户概览 */}
      <AccountOverview
        coupons={userInfo.coupons}
        laobi={userInfo.laobi}
        cardPack={userInfo.cardPack}
        onlineCard={userInfo.onlineCard}
      />

      {/* 公告栏 */}
      <AnnouncementBar />

      {/* 功能图标行 */}
      <FeatureIcons features={featureIcons} />

      {/* 设置和帮助列表 */}
      <MenuList items={menuItems} />

      {/* 浮动按钮 */}
      <div className="fixed right-4 bottom-24 z-30">
        <Button className="bg-red-500 hover:bg-red-600 text-white rounded-full px-4 py-2 shadow-lg">
          <div className="text-center">
            <div className="text-xs font-medium">开卡领取</div>
            <div className="text-[10px] opacity-90">专属权益</div>
          </div>
        </Button>
      </div>
    </div>
  );
}
