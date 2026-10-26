export interface SiteSetting {
  id: string;
  marqueeEnabled: boolean;
  notices: string[];
  updatedAt: string;
}

export interface UpdateSiteSettingPayload {
  marqueeEnabled?: boolean;
  notices?: string[];
}
