export interface PublicCertificateDto {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  imageUrl?: string | null;
  category?: string | null;
  displayOrder: number;
}
