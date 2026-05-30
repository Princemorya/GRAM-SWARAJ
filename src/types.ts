/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type IncidentCategory = 'Water' | 'Power' | 'Roads' | 'Medical' | 'Waste' | 'General';

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

export type IncidentStatus = 'Pending' | 'Investigating' | 'Scheduled' | 'Resolved';

export type UserRole = 'Resident' | 'Gram Pradhan' | 'DM' | 'Admin';

export interface VillageCommunity {
  id: string;
  name: string;
  state: string;       // e.g. "Uttar Pradesh"
  district: string;    // e.g. "Bareilly"
  region: string;
  population: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  phone: string;
  role: UserRole;
  email?: string;
  villageId: string;   // Associated village ID
  isVerified: boolean; // Verification flag from Admin
  joinedAt: string;
}

export interface IssueComment {
  id: string;
  authorName: string;
  authorRole: string;
  message: string;
  createdAt: string;
}

export interface ProgressUpdate {
  id: string;
  updaterName: string;
  status: IncidentStatus;
  notes: string;
  timestamp: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: Severity;
  status: IncidentStatus;
  villageId: string;
  reporterName: string;
  reporterPhone: string;
  reporterId: string;
  isAnonymous?: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  upvotedBy: string[]; // List of user phones/uids who upvoted
  comments?: IssueComment[];
  progressUpdates?: ProgressUpdate[];
}

export type MarketplaceCategory = 'Goods' | 'Services' | 'Jobs';

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: string;
  category: MarketplaceCategory;
  contactName: string;
  contactPhone: string;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: string;
  postedBy: string; // Phone/ID of poster
}

export type SubgroupType = 'Farmers' | 'Youth' | 'Women' | 'General';

export interface GroupMessage {
  id: string;
  group: SubgroupType;
  senderName: string;
  senderPhone: string;
  message: string;
  isAnonymous: boolean;
  createdAt: string;
  villageId?: string;
}

export interface EmergencyBroadcast {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  severity: 'Immediate' | 'Important' | 'General';
  postedBy: string;
  villageId?: string; // Optional: empty means district-wide, set means specific village
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'sms' | 'system' | 'whatsapp';
}
