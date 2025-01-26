export interface EmailTemplate {
  id: string;
  name: string;
  type:
    | "event"
    | "invite"
    | "announcement"
    | "newsletter"
    | "birthday"
    | "recall"
    | "reactivation"
    | "reminder"
    | "anniversary"
    | "referral"
    | "custom";
  thumbnail?: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  template: EmailTemplate;
  status: "draft" | "scheduled" | "sending" | "sent" | "error";
  schedule?: {
    date: string;
    time: string;
  };
  recipients: {
    type: "all" | "segment" | "list";
    criteria?: {
      field: string;
      operator: string;
      value: string;
    }[];
    list?: string[];
  };
  stats?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EmailProvider {
  id: string;
  name: string;
  icon: string;
  apiKey?: string;
  connected?: boolean;
}

export interface EmailRecipient {
  id: string;
  email: string;
  name?: string;
  type: "patient" | "lead";
  tags?: string[];
  lastEngagement?: string;
  status: "active" | "unsubscribed" | "bounced";
}

export interface EmailList {
  id: string;
  name: string;
  description?: string;
  recipients: EmailRecipient[];
  createdAt: string;
  updatedAt: string;
}

export interface EmailSegment {
  id: string;
  name: string;
  description?: string;
  criteria: {
    field: string;
    operator: string;
    value: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
