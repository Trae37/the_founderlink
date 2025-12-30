export type FeatureCatalogOption = {
  value: string;
  label: string;
  tooltip?: string;
};

export type FeatureCatalogGroup = {
  category: string;
  options: FeatureCatalogOption[];
};

export const Q4_FEATURE_CATALOG: FeatureCatalogGroup[] = [
  {
    category: "Auth & Accounts",
    options: [
      { value: "auth_email_password", label: "Email/password login" },
      { value: "auth_magic_link", label: "Magic link / passwordless login" },
      { value: "auth_social_login", label: "Social login (Google/Apple/etc.)" },
      { value: "auth_password_reset", label: "Password reset" },
      { value: "email_verification", label: "Email verification" },
      { value: "user_profiles", label: "User profiles" },
      { value: "team_accounts", label: "Teams / workspaces" },
      { value: "roles_permissions", label: "Roles & permissions" },
    ],
  },
  {
    category: "Billing & Monetization",
    options: [
      { value: "payments_one_time", label: "One-time payments" },
      { value: "billing_subscriptions", label: "Subscriptions" },
      { value: "free_trial", label: "Free trial" },
      { value: "usage_based_billing", label: "Usage-based billing" },
      { value: "checkout_flow", label: "Checkout / paywall" },
      { value: "invoices_receipts", label: "Invoices / receipts" },
      { value: "coupons_discounts", label: "Discount codes" },
      { value: "refunds_cancellations", label: "Cancellations / refunds" },
    ],
  },
  {
    category: "Core Product (SaaS)",
    options: [
      { value: "dashboard_home", label: "Dashboard / home" },
      { value: "settings_preferences", label: "Settings" },
      { value: "search_filter", label: "Search + filters" },
      { value: "data_import", label: "Data import" },
      { value: "data_export", label: "Data export" },
      { value: "audit_logs", label: "Audit logs" },
      { value: "activity_feed", label: "Activity feed" },
      { value: "feature_flags", label: "Feature flags" },
    ],
  },
  {
    category: "Collaboration",
    options: [
      { value: "comments_mentioning", label: "Comments + @mentions" },
      { value: "real_time_chat", label: "In-app chat" },
      { value: "shared_workspaces", label: "Shared workspaces" },
      { value: "invites_members", label: "Invites + member management" },
      { value: "roles_approval", label: "Approvals / review flows" },
      { value: "version_history", label: "Version history" },
      { value: "notifications_in_app", label: "In-app notifications" },
      { value: "notifications_email", label: "Email notifications" },
    ],
  },
  {
    category: "Admin & Analytics",
    options: [
      { value: "admin_dashboard", label: "Admin dashboard" },
      { value: "user_management", label: "User management" },
      { value: "role_management", label: "Role management" },
      { value: "analytics_dashboard", label: "Analytics dashboard" },
      { value: "reports_exports", label: "Reports" },
      { value: "support_tools", label: "Support / ticketing tools" },
      { value: "admin_impersonation", label: "Admin impersonation" },
    ],
  },
  {
    category: "Files & Content",
    options: [
      { value: "file_uploads", label: "File uploads" },
      { value: "rich_text_editor", label: "Rich text editor" },
      { value: "document_viewer", label: "Document viewer" },
      { value: "templates", label: "Templates" },
      { value: "content_moderation", label: "Content moderation" },
      { value: "public_sharing_links", label: "Public sharing links" },
    ],
  },
  {
    category: "Integrations & API",
    options: [
      { value: "third_party_api_integration", label: "Third-party integrations" },
      { value: "oauth_integrations", label: "OAuth integrations" },
      { value: "api_keys", label: "API keys" },
      { value: "public_api", label: "Public API" },
      { value: "webhooks_incoming", label: "Incoming webhooks" },
      { value: "webhooks_outgoing", label: "Outgoing webhooks" },
      { value: "zapier_integration", label: "Zapier integration" },
      { value: "slack_integration", label: "Slack integration" },
    ],
  },
] as FeatureCatalogGroup[];

export const Q4_FEATURE_ID_TO_LABEL: Record<string, string> = Object.fromEntries(
  Q4_FEATURE_CATALOG.flatMap((group) =>
    group.options.map((opt) => [opt.value, opt.label ?? opt.value] as const)
  )
);

export function getCoreFeaturesFromQ4Answer(q4: unknown): string[] {
  if (Array.isArray(q4)) {
    const ids = q4.map((x) => String(x || "").trim()).filter(Boolean);
    const labels = ids.map((id) => Q4_FEATURE_ID_TO_LABEL[id] || id);
    const unique: string[] = [];
    for (const f of labels) {
      if (!unique.includes(f)) unique.push(f);
    }
    return unique;
  }

  if (q4 && typeof q4 === "object") {
    const v = q4 as any;
    const coreFeatures = [v?.feature1, v?.feature2, v?.feature3, v?.feature4, v?.feature5]
      .map((x: any) => String(x || "").trim())
      .filter(Boolean);
    const unique: string[] = [];
    for (const f of coreFeatures) {
      if (!unique.includes(f)) unique.push(f);
    }
    return unique;
  }

  return [];
}
