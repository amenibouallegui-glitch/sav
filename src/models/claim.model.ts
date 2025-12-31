export interface Claim {
  id: string;
  clientId: string;
  client?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  productId?: string;
  product?: {
    name: string;
    model: string;
    serialNumber: string;
  };
  title: string;
  description: string;
  issueType: 'Defect' | 'Malfunction' | 'Damage' | 'Installation' | 'Other';
  status: 'Pending' | 'InProgress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  isUnderWarranty: boolean;
  estimatedCost?: number;
  actualCost?: number;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface CreateClaimRequest {
  clientId: string;
  productId?: string;
  title: string;
  description: string;
  issueType: 'Defect' | 'Malfunction' | 'Damage' | 'Installation' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}