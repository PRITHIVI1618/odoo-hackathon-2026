import { api } from '@/lib/axios';

export interface GovernanceDashboardKpis {
  activePolicies: number;
  pendingAcknowledgements: number;
  upcomingAudits: number;
  openComplianceIssues: number;
  openRisks: number;
  overallGovernanceScore: number;
  policyCompliancePercentage: number;
  auditCompletionPercentage: number;
}

export interface GovChartData {
  name: string;
  value: number;
  fill?: string;
}

export interface DepartmentGovernanceScore {
  departmentName: string;
  score: number;
}

export interface Policy {
  id: number;
  title: string;
  policyCode: string;
  category: string;
  version: string;
  description: string;
  effectiveDate: string;
  reviewDate: string;
  ownerDepartment: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyAcknowledgement {
  id: number;
  policy: Policy;
  employee: any;
  acknowledgedAt: string;
  status: string;
  remarks: string;
}

export interface Audit {
  id: number;
  auditName: string;
  department: any;
  auditor: any;
  scheduledDate: string;
  completedDate: string;
  scope: string;
  status: string;
  summary: string;
}

export interface ComplianceIssue {
  id: number;
  audit: Audit;
  department: any;
  title: string;
  description: string;
  severity: string;
  owner: any;
  dueDate: string;
  status: string;
}

export interface Risk {
  id: number;
  riskCode: string;
  title: string;
  category: string;
  likelihood: number;
  impact: number;
  riskScore: number;
  mitigationPlan: string;
  owner: any;
  status: string;
}

export interface CorrectiveAction {
  id: number;
  issue: ComplianceIssue;
  actionDescription: string;
  assignedTo: any;
  targetDate: string;
  completedDate: string;
  status: string;
  remarks: string;
}

export const GovernanceService = {
  getDashboardKpis: async (): Promise<GovernanceDashboardKpis> => {
    const response = await api.get('/governance/dashboard/kpis');
    return response.data;
  },
  
  getPolicyStatusDistribution: async (): Promise<GovChartData[]> => {
    const response = await api.get('/governance/dashboard/policy-status');
    return response.data;
  },

  getRiskMatrix: async (): Promise<GovChartData[]> => {
    const response = await api.get('/governance/dashboard/risk-matrix');
    return response.data;
  },

  getDepartmentScores: async (): Promise<DepartmentGovernanceScore[]> => {
    const response = await api.get('/governance/dashboard/department-scores');
    return response.data;
  },

  // Policies
  getPolicies: async (): Promise<Policy[]> => {
    const response = await api.get('/governance/policies');
    return response.data;
  },

  // Acknowledgements
  getAcknowledgements: async (): Promise<PolicyAcknowledgement[]> => {
    const response = await api.get('/governance/acknowledgements');
    return response.data;
  },
  
  acknowledgePolicy: async (id: number): Promise<PolicyAcknowledgement> => {
    const response = await api.put(`/governance/acknowledgements/${id}/acknowledge`);
    return response.data;
  },

  // Audits
  getAudits: async (): Promise<Audit[]> => {
    const response = await api.get('/governance/audits');
    return response.data;
  },

  // Issues
  getIssues: async (): Promise<ComplianceIssue[]> => {
    const response = await api.get('/governance/issues');
    return response.data;
  },

  // Risks
  getRisks: async (): Promise<Risk[]> => {
    const response = await api.get('/governance/risks');
    return response.data;
  },

  // Corrective Actions
  getCorrectiveActions: async (): Promise<CorrectiveAction[]> => {
    const response = await api.get('/governance/corrective-actions');
    return response.data;
  }
};
