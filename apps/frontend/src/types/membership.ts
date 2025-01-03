export interface MembershipTier {
  id: string;
  name: string;
  price: {
    monthly: number;
    annual: number;
  };
  benefits: string[];
  pointsMultiplier: number;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: 'treatment' | 'product' | 'service';
  imageUrl?: string;
}

export interface MembershipActivity {
  id: string;
  type: 'visit' | 'treatment' | 'referral' | 'review' | 'purchase';
  points: number;
  description: string;
  date: string;
}

export interface PatientMembership {
  id: string;
  patientId: string;
  tierId: string;
  startDate: string;
  renewalDate: string;
  paymentFrequency: 'monthly' | 'annual';
  status: 'active' | 'inactive' | 'pending';
  totalPoints: number;
  pointsHistory: MembershipActivity[];
}