
export type UserType = 'buyer' | 'owner' | 'agent' | 'agency';

export type SubscriptionPlanType = 'free' | 'personal' | 'professional' | 'custom';

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  type: UserType;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
  subscriptionPlanId?: SubscriptionPlanType;
  avatarUrl?: string | null;
  
  // Agent specific fields
  creci?: string | null;
  
  // Agency specific fields
  agencyName?: string | null;
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  type: UserType;
  subscriptionPlanId?: SubscriptionPlanType;
}
