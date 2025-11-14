
export type Lesson = {
    id: string;
    institutionId: string;
    institutionName: string;
    startTime: string; // ISO 8601 string
    endTime: string; // ISO 8601 string
    totalValue: number;
    status: 'Scheduled' | 'Completed' | 'Cancelled';
    turma?: string;
    disciplina?: string;
};

export type SubscriptionStatus = 
  | 'trialing' 
  | 'active' 
  | 'past_due' 
  | 'canceled' 
  | 'unpaid' 
  | 'incomplete';

export type UserProfile = {
    id: string;
    name: string;
    email: string;
    dasDueDate: number;
    streakDays: number;
    xpTotal: number;
    stripeCustomerId?: string;
    trialEndsAt?: string;
    subscriptionStatus: SubscriptionStatus;
    createdAt: string;
    isAdmin?: boolean;
};

export type Subscription = {
    stripeSubscriptionId?: string;
    stripePriceId?: string;
    status: SubscriptionStatus;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd: boolean;
    trialEnd?: string;
};
