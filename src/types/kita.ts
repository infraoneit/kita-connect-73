// KitaConnect Type Definitions

export type UserRole = 'parent' | 'educator' | 'management' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  groupIds: string[];
}

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  groupId: string;
  parentIds: string[];
  photoPermission: boolean;
  allergies: string[];
  emergencyContacts: EmergencyContact[];
  pickupAuthorizations: PickupPerson[];
  avatar?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface PickupPerson {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface Group {
  id: string;
  name: string;
  educatorIds: string[];
  childIds: string[];
  color: string;
}

export type AbsenceType = 'sick' | 'vacation' | 'late' | 'early_pickup' | 'other';

export interface Absence {
  id: string;
  childId: string;
  type: AbsenceType;
  startDate: string;
  endDate: string;
  note?: string;
  reportedBy: string;
  reportedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'document';
  url: string;
  name: string;
}

export interface Chat {
  id: string;
  type: 'group' | 'direct';
  name: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  allDay: boolean;
  type: 'event' | 'closure' | 'meeting' | 'reminder';
  groupIds: string[];
}

export interface PinnedPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  important: boolean;
  attachments?: Attachment[];
  groupIds: string[];
}

export interface DiaryEntry {
  id: string;
  groupId: string;
  date: string;
  content: string;
  author: string;
  photos: string[];
  createdAt: string;
}

export interface AttendanceStatus {
  childId: string;
  status: 'present' | 'absent' | 'late' | 'not_arrived';
  checkInTime?: string;
  checkOutTime?: string;
  absenceType?: AbsenceType;
}
