export interface User {
  id: string;
  email: string;
  fullName?: string;
}

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  subdomain: string;
  description?: string;
  logoUrl?: string;
  customDomain?: string;
  active: boolean;
  createdAt: string;
  subscription?: {
    plan: 'monthly' | 'yearly' | 'three_year';
    startDate: string;
    endDate: string;
    status: 'active' | 'overdue' | 'expired';
  };
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    pinterest?: string;
  };
  analytics?: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  price: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  durationUnit: 'month' | 'year';
}

export interface DiscountCode {
  id: string;
  storeId: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxUses?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface AffiliateProgram {
  id: string;
  storeId: string;
  name: string;
  commission: number;
  commissionType: 'percentage' | 'fixed';
  cookieDuration: number;
  active: boolean;
}

export interface Analytics {
  revenue: {
    daily: number[];
    labels: string[];
  };
  orders: {
    daily: number[];
    labels: string[];
  };
  topProducts: {
    name: string;
    sales: number;
    revenue: number;
  }[];
  customerStats: {
    total: number;
    new: number;
    returning: number;
  };
}