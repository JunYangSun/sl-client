"use client";
interface AccountOverviewProps {
  coupons: number;
  laobi: number;
  cardPack: number;
  onlineCard: number;
}

export default function AccountOverview({
  coupons,
  laobi,
  cardPack,
  onlineCard,
}: AccountOverviewProps) {
  return (
    <div className="px-4 mb-4">
      <div className="grid grid-cols-4 gap-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground mb-1">{coupons}</div>
          <div className="text-xs text-muted-foreground">余额</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground mb-1">{laobi}</div>
          <div className="text-xs text-muted-foreground">收藏</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground mb-1">{cardPack}</div>
          <div className="text-xs text-muted-foreground">提现</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground mb-1">{onlineCard}</div>
          <div className="text-xs text-muted-foreground">充值</div>
        </div>
      </div>
    </div>
  );
}

