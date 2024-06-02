export interface Invitation {
  id: string;
  email?: string;
  phoneNumber?: string;
  foyerId: string;
  status: 'sent' | 'accepted' | 'declined';
  token: string;
  createdAt: Date;
  expiresAt: Date;
}
