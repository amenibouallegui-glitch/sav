export interface Intervention {
  id: string;
  clientId: string;
  client?: {
    firstName: string;
    lastName: string;
  };
  claimId?: string;
  productId?: string;
  title: string;
  description: string;
  interventionType: 'Repair' | 'Maintenance' | 'Installation' | 'Diagnostic' | 'Replacement';
  status: 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';
  scheduledDate: string;
  completedDate?: string;
  technicianName: string;
  technicianId: string;
  estimatedDuration: number; // en minutes
  actualDuration?: number;
  partsUsed?: string[];
  cost?: number;
  notes?: string;
  customerSignature?: boolean;
  satisfactionRating?: number; // 1-5
  createdAt: string;
}

export interface CreateInterventionRequest {
  clientId: string;
  claimId?: string;
  productId?: string;
  title: string;
  description: string;
  interventionType: 'Repair' | 'Maintenance' | 'Installation' | 'Diagnostic' | 'Replacement';
  scheduledDate: string;
  technicianName: string;
  technicianId: string;
  estimatedDuration: number;
}