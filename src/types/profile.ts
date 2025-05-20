
export type UserType = 'professor' | 'instituicao' | 'aluno' | 'pais';

export type SubscriptionPlanType = 'inicial' | 'essencial' | 'maestro' | 'institucional';

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
  schoolName?: string | null;
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  type: UserType;
  subscriptionPlanId?: SubscriptionPlanType;
}
