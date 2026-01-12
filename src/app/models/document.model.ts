export interface Document {
  id?: number;
  documentType: string;
  documentNumber: string;
  documentDate: string;
  issuerRuc: string;
  amount: number;
  imageBase64: string;
}
