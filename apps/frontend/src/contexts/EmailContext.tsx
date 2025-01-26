import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { z } from "zod";
import type {
  EmailTemplate,
  EmailCampaign,
  EmailProvider,
} from "../types/email";

const EmailStatsSchema = z.object({
  sequences: z.number(),
  subscribers: z.number(),
  openRate: z.number(),
  opportunities: z.number(),
});

type EmailStats = z.infer<typeof EmailStatsSchema>;

interface EmailState {
  stats: EmailStats;
  templates: EmailTemplate[];
  campaigns: EmailCampaign[];
  providers: EmailProvider[];
  selectedProvider: EmailProvider | null;
  loading: boolean;
  error: string | null;
}

type EmailAction =
  | { type: "SET_STATS"; payload: EmailStats }
  | { type: "SET_TEMPLATES"; payload: EmailTemplate[] }
  | { type: "SET_CAMPAIGNS"; payload: EmailCampaign[] }
  | { type: "SET_PROVIDERS"; payload: EmailProvider[] }
  | { type: "SET_SELECTED_PROVIDER"; payload: EmailProvider | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const emailReducer = (state: EmailState, action: EmailAction): EmailState => {
  switch (action.type) {
    case "SET_STATS":
      return { ...state, stats: action.payload };
    case "SET_TEMPLATES":
      return { ...state, templates: action.payload };
    case "SET_CAMPAIGNS":
      return { ...state, campaigns: action.payload };
    case "SET_PROVIDERS":
      return { ...state, providers: action.payload };
    case "SET_SELECTED_PROVIDER":
      return { ...state, selectedProvider: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const EmailContext = createContext<
  | {
      state: EmailState;
      dispatch: React.Dispatch<EmailAction>;
    }
  | undefined
>(undefined);

export const EmailProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(emailReducer, {
    templates: [],
    campaigns: [],
    providers: [
      { id: "mailchimp", name: "Mailchimp", icon: "Mail" },
      { id: "constant-contact", name: "Constant Contact", icon: "Mail" },
      { id: "sendgrid", name: "SendGrid", icon: "Mail" },
    ],
    selectedProvider: null,
    stats: {
      sequences: 12,
      subscribers: 2500,
      openRate: 45,
      opportunities: 18,
    },
    loading: false,
    error: null,
  });

  return (
    <EmailContext.Provider value={{ state, dispatch }}>
      {children}
    </EmailContext.Provider>
  );
};

export const useEmail = () => {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error("useEmail must be used within an EmailProvider");
  }
  return context;
};
