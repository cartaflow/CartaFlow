export interface ClientSession {
  token: string;
  ipAddress: string;
  device: string;
  browser: string;
  os: string;
  updatedAt: Date;
}

export interface UserProfile {
  username: string;
  displayName: string;
  description: string;
}
