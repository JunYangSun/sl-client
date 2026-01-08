"use client";

// 功能特性数据类型
export interface FeatureItem {
  id: string;
  icon?: string;
  title: string;
  description: string;
  content: string;
}

// Hero 区域数据类型
export interface HeroData {
  title: string;
  subtitle: string;
  primaryButton: {
    text: string;
    href: string;
  };
  secondaryButton: {
    text: string;
    href: string;
  };
}

// CTA 区域数据类型
export interface CtaData {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

// Hero 轮播图数据类型
export interface HeroSlide {
  id: string;
  img: string;
  alt: string;
  href?: string;
  title?: string;
  subtitle?: string;
}

// 活动数据类型
export interface ActivityItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  badge?: string;
  status?: 'ongoing' | 'upcoming' | 'ended';
  startDate?: string;
  endDate?: string;
  href?: string;
}

// 服务项目类型
export interface ServiceItem {
  id: string;
  name: string;
  icon?: string;
  description: string;
  href: string;
}

// 服务优势类型
export interface AdvantageItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

// 客户案例类型
export interface CaseItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category?: string;
  href?: string;
}

// 服务流程类型
export interface ProcessItem {
  id: string;
  step: number;
  title: string;
  description: string;
  icon?: string;
}

// Logo 类型
export interface LogoItem {
  id: string;
  img: string;
  alt: string;
  href?: string;
}

// 首页完整数据类型
export interface HomeData {
  hero: HeroData;
  heroSlides: HeroSlide[];
  features: FeatureItem[];
  cta: CtaData;
  activities: ActivityItem[];
  services: ServiceItem[];
  advantages: AdvantageItem[];
  cases: CaseItem[];
  processes: ProcessItem[];
  logos: LogoItem[];
}

// 首页 Props 类型（供模板组件使用）
export interface HomeTemplateProps {
  data: HomeData;
}

/**
 * 获取首页数据的 Hook
 * 后续可扩展为从 API 获取数据
 */
export function useHomeData(): HomeData {
  // 静态数据，后续可改为从 API 获取
  const data: HomeData = {
    hero: {
      title: "专业的服务提供商",
      subtitle: "为您提供全方位的高质量服务解决方案，助力企业数字化转型与业务增长",
      primaryButton: {
        text: "了解服务",
        href: "/services",
      },
      secondaryButton: {
        text: "联系我们",
        href: "/contact",
      },
    },
    heroSlides: [
      {
        id: 'hero-1',
        img: 'https://picsum.photos/3840/600?image=1028',
        alt: '春季新品全面上线',
        href: '/campaign/spring',
      },
      {
        id: 'hero-2',
        img: 'https://picsum.photos/3840/600?image=1032',
        alt: '限时折扣 · 最高 50% OFF',
        href: '/campaign/sale',
      },
      {
        id: 'hero-3',
        img: 'https://picsum.photos/3840/600?image=1018',
        alt: '限时折扣 · 最高 30% OFF',
        href: '/campaign/sale',
      },
      {
        id: 'hero-4',
        img: 'https://picsum.photos/3840/600?image=1019',
        alt: '限时折扣 · 最高 40% OFF',
        href: '/campaign/sale',
      },
      {
        id: 'hero-5',
        img: 'https://picsum.photos/3840/600?image=1036',
        alt: '限时折扣 · 最高 60% OFF',
        href: '/campaign/sale',
      },
      {
        id: 'hero-6',
        img: 'https://picsum.photos/3840/600?image=1043',
        alt: '限时折扣 · 最高 70% OFF',
        href: '/campaign/sale',
      },
    ],
    features: [
      {
        id: "professional",
        icon: "🎯",
        title: "专业团队",
        description: "拥有多年行业经验的专业服务团队",
        content: "我们的团队由资深专家组成，具备丰富的项目经验和深厚的行业知识，能够为您提供专业、可靠的服务支持",
      },
      {
        id: "quality",
        icon: "⭐",
        title: "品质保证",
        description: "严格的质量控制体系，确保服务品质",
        content: "建立完善的质量管理体系，从需求分析到项目交付，每个环节都严格把控，确保交付成果的高质量",
      },
      {
        id: "efficient",
        icon: "⚡",
        title: "高效交付",
        description: "快速响应，及时交付，提升业务效率",
        content: "采用敏捷开发方法，快速响应客户需求，确保项目按时高质量交付，帮助您快速实现业务目标",
      },
    ],
    cta: {
      title: "准备好开始了吗？",
      description: "立即注册账户，体验全新的应用功能",
      buttonText: "免费注册",
      buttonHref: "/register",
    },
    activities: [
      {
        id: 'act-001',
        title: '春季新品发布会',
        subtitle: '全新产品线震撼登场',
        description: '探索最新护肤科技，体验前所未有的美丽之旅',
        image: 'https://picsum.photos/id/1015/400/400',
        badge: '热门',
        status: 'ongoing',
        startDate: '2024-03-01',
        endDate: '2024-03-31',
        href: '/activity/act-001',
      },
      {
        id: 'act-002',
        title: '会员专享折扣',
        subtitle: '全场8折优惠',
        description: '会员专享特权，精选商品超值优惠',
        image: 'https://picsum.photos/id/1021/400/400',
        status: 'ongoing',
        startDate: '2024-03-15',
        endDate: '2024-04-15',
        href: '/activity/act-002',
      },
      {
        id: 'act-003',
        title: '限时秒杀活动',
        subtitle: '每日10点开抢',
        description: '每日限量秒杀，超值价格不容错过',
        image: 'https://picsum.photos/id/1031/400/400',
        badge: '限时',
        status: 'ongoing',
        startDate: '2024-03-20',
        endDate: '2024-04-20',
        href: '/activity/act-003',
      },
      {
        id: 'act-004',
        title: '新品体验会',
        subtitle: '免费试用新品',
        description: '邀请您亲身体验最新产品，感受科技魅力',
        image: 'https://picsum.photos/id/1043/400/400',
        badge: '免费',
        status: 'upcoming',
        startDate: '2024-04-01',
        endDate: '2024-04-10',
        href: '/activity/act-004',
      },
      {
        id: 'act-005',
        title: '积分翻倍活动',
        subtitle: '消费积分双倍',
        description: '活动期间消费，积分翻倍累积，兑换更多好礼',
        image: 'https://picsum.photos/id/1050/400/400',
        status: 'ongoing',
        startDate: '2024-03-10',
        endDate: '2024-03-30',
        href: '/activity/act-005',
      },
      {
        id: 'act-006',
        title: '美妆达人分享会',
        subtitle: '专业美妆技巧',
        description: '邀请美妆达人分享护肤心得，学习专业技巧',
        image: 'https://picsum.photos/id/1062/400/400',
        badge: '活动',
        status: 'upcoming',
        startDate: '2024-04-05',
        endDate: '2024-04-12',
        href: '/activity/act-006',
      },
      {
        id: 'act-007',
        title: '满减优惠活动',
        subtitle: '满500减100',
        description: '单笔订单满500元，立减100元，多买多省',
        image: 'https://picsum.photos/id/1074/400/400',
        status: 'ongoing',
        startDate: '2024-03-25',
        endDate: '2024-04-25',
        href: '/activity/act-007',
      },
      {
        id: 'act-008',
        title: '品牌周年庆典',
        subtitle: '周年庆特惠',
        description: '品牌成立周年庆典，感恩回馈，超值优惠',
        image: 'https://picsum.photos/id/1084/400/400',
        badge: '庆典',
        status: 'upcoming',
        startDate: '2024-04-15',
        endDate: '2024-05-15',
        href: '/activity/act-008',
      },
      {
        id: 'act-009',
        title: '新品预售活动',
        subtitle: '提前预订享优惠',
        description: '新品提前预订，享受专属优惠价格',
        image: 'https://picsum.photos/id/1080/400/400',
        badge: '预售',
        status: 'upcoming',
        startDate: '2024-04-01',
        endDate: '2024-04-20',
        href: '/activity/act-009',
      },
      {
        id: 'act-010',
        title: '会员生日礼',
        subtitle: '生日月专属福利',
        description: '会员生日月专享礼品，感谢您的支持',
        image: 'https://picsum.photos/id/109/400/400',
        status: 'ongoing',
        startDate: '2024-03-01',
        endDate: '2024-12-31',
        href: '/activity/act-010',
      },
      {
        id: 'act-011',
        title: '春季护肤节',
        subtitle: '春季护肤指南',
        description: '春季护肤全攻略，专业指导，科学护肤',
        image: 'https://picsum.photos/id/110/400/400',
        badge: '推荐',
        status: 'ongoing',
        startDate: '2024-03-01',
        endDate: '2024-05-31',
        href: '/activity/act-011',
      },
      {
        id: 'act-012',
        title: '新品试用装领取',
        subtitle: '免费领取试用',
        description: '免费领取新品试用装，先试后买更放心',
        image: 'https://picsum.photos/id/111/400/400',
        status: 'ongoing',
        startDate: '2024-03-15',
        endDate: '2024-04-15',
        href: '/activity/act-012',
      },
    ],
    services: [
      {
        id: 'service-001',
        name: '技术咨询',
        icon: '💡',
        description: '提供专业的技术咨询服务，帮助您制定最佳技术方案',
        href: '/services/consulting',
      },
      {
        id: 'service-002',
        name: '系统开发',
        icon: '💻',
        description: '定制化系统开发，满足您的业务需求',
        href: '/services/development',
      },
      {
        id: 'service-003',
        name: '运维支持',
        icon: '🔧',
        description: '7x24小时运维支持，保障系统稳定运行',
        href: '/services/maintenance',
      },
      {
        id: 'service-004',
        name: '数据分析',
        icon: '📊',
        description: '专业的数据分析服务，挖掘数据价值',
        href: '/services/analytics',
      },
      {
        id: 'service-005',
        name: '云服务',
        icon: '☁️',
        description: '提供稳定可靠的云服务解决方案',
        href: '/services/cloud',
      },
      {
        id: 'service-006',
        name: '培训服务',
        icon: '📚',
        description: '专业的技术培训，提升团队能力',
        href: '/services/training',
      },
    ],
    advantages: [
      {
        id: 'adv-001',
        title: '丰富的行业经验',
        description: '服务过数百家企业，积累了丰富的行业经验和成功案例',
        icon: '🏆',
      },
      {
        id: 'adv-002',
        title: '专业技术团队',
        description: '拥有资深的技术专家团队，具备强大的技术实力',
        icon: '👥',
      },
      {
        id: 'adv-003',
        title: '完善的服务体系',
        description: '建立完善的服务流程和质量保障体系，确保服务质量',
        icon: '✅',
      },
      {
        id: 'adv-004',
        title: '快速响应能力',
        description: '快速响应客户需求，及时提供解决方案和技术支持',
        icon: '⚡',
      },
    ],
    cases: [
      {
        id: 'case-001',
        title: '某大型企业数字化转型项目',
        description: '帮助客户完成全面的数字化转型，提升业务效率30%',
        image: 'https://picsum.photos/id/1018/800/600',
        category: '数字化转型',
        href: '/cases/case-001',
      },
      {
        id: 'case-002',
        title: '电商平台系统优化',
        description: '优化电商平台性能，提升用户体验，订单量增长25%',
        image: 'https://picsum.photos/id/1025/800/600',
        category: '系统优化',
        href: '/cases/case-002',
      },
      {
        id: 'case-003',
        title: '金融行业风控系统',
        description: '构建智能风控系统，有效降低风险，提升业务安全性',
        image: 'https://picsum.photos/id/1035/800/600',
        category: '金融科技',
        href: '/cases/case-003',
      },
      {
        id: 'case-004',
        title: '制造业ERP系统实施',
        description: '成功实施ERP系统，实现生产管理数字化，效率提升40%',
        image: 'https://picsum.photos/id/1041/800/600',
        category: '企业信息化',
        href: '/cases/case-004',
      },
    ],
    processes: [
      {
        id: 'process-001',
        step: 1,
        title: '需求分析',
        description: '深入了解客户需求，进行详细的需求分析和方案设计',
        icon: '📋',
      },
      {
        id: 'process-002',
        step: 2,
        title: '方案制定',
        description: '制定专业的解决方案，明确项目目标和实施计划',
        icon: '📝',
      },
      {
        id: 'process-003',
        step: 3,
        title: '项目实施',
        description: '按照计划执行项目，确保质量和进度，及时沟通反馈',
        icon: '🚀',
      },
      {
        id: 'process-004',
        step: 4,
        title: '验收交付',
        description: '项目验收测试，确保符合要求，完成交付和培训',
        icon: '✅',
      },
      {
        id: 'process-005',
        step: 5,
        title: '持续支持',
        description: '提供持续的运维支持和技术服务，保障系统稳定运行',
        icon: '🔧',
      },
    ],
    logos: [
      { id: "l1", img: "https://picsum.photos/id/1011/320/140", alt: "Logo 1" },
      { id: "l2", img: "https://picsum.photos/id/1012/320/140", alt: "Logo 2" },
      { id: "l3", img: "https://picsum.photos/id/1013/320/140", alt: "Logo 3" },
      { id: "l4", img: "https://picsum.photos/id/1014/320/140", alt: "Logo 4" },
      { id: "l5", img: "https://picsum.photos/id/1015/320/140", alt: "Logo 5" },
      { id: "l6", img: "https://picsum.photos/id/1016/320/140", alt: "Logo 6" },
      { id: "l7", img: "https://picsum.photos/id/1018/320/140", alt: "Logo 7" },
      { id: "l8", img: "https://picsum.photos/id/1020/320/140", alt: "Logo 8" },
    ],
  };

  return data;
}

export default useHomeData;

