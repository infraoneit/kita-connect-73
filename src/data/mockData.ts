import { User, Child, Group, Chat, PinnedPost, CalendarEvent, DiaryEntry, Absence, AttendanceStatus } from '@/types/kita';

export const currentUser: User = {
  id: 'user-1',
  name: 'Maria Schmidt',
  email: 'maria.schmidt@sonnenschein-kita.de',
  role: 'educator',
  groupIds: ['group-1'],
};

export const groups: Group[] = [
  {
    id: 'group-1',
    name: 'Sonnenkäfer',
    educatorIds: ['user-1', 'user-2'],
    childIds: ['child-1', 'child-2', 'child-3', 'child-4', 'child-5', 'child-6', 'child-7', 'child-8'],
    color: '#4A9D8E',
  },
  {
    id: 'group-2',
    name: 'Schmetterlinge',
    educatorIds: ['user-3'],
    childIds: ['child-9', 'child-10'],
    color: '#E88D4E',
  },
];

export const children: Child[] = [
  {
    id: 'child-1',
    firstName: 'Emma',
    lastName: 'Müller',
    birthDate: '2021-03-15',
    groupId: 'group-1',
    parentIds: ['parent-1'],
    photoPermission: true,
    allergies: ['Nüsse'],
    emergencyContacts: [
      { id: 'ec-1', name: 'Thomas Müller', phone: '+49 171 1234567', relationship: 'Vater' }
    ],
    pickupAuthorizations: [
      { id: 'pa-1', name: 'Oma Helga', phone: '+49 172 9876543', relationship: 'Großmutter' }
    ],
  },
  {
    id: 'child-2',
    firstName: 'Leon',
    lastName: 'Weber',
    birthDate: '2020-08-22',
    groupId: 'group-1',
    parentIds: ['parent-2'],
    photoPermission: true,
    allergies: [],
    emergencyContacts: [],
    pickupAuthorizations: [],
  },
  {
    id: 'child-3',
    firstName: 'Mia',
    lastName: 'Fischer',
    birthDate: '2021-01-10',
    groupId: 'group-1',
    parentIds: ['parent-3'],
    photoPermission: false,
    allergies: ['Laktose'],
    emergencyContacts: [],
    pickupAuthorizations: [],
  },
  {
    id: 'child-4',
    firstName: 'Noah',
    lastName: 'Becker',
    birthDate: '2020-11-05',
    groupId: 'group-1',
    parentIds: ['parent-4'],
    photoPermission: true,
    allergies: [],
    emergencyContacts: [],
    pickupAuthorizations: [],
  },
  {
    id: 'child-5',
    firstName: 'Sophie',
    lastName: 'Hoffmann',
    birthDate: '2021-06-18',
    groupId: 'group-1',
    parentIds: ['parent-5'],
    photoPermission: true,
    allergies: [],
    emergencyContacts: [],
    pickupAuthorizations: [],
  },
  {
    id: 'child-6',
    firstName: 'Ben',
    lastName: 'Koch',
    birthDate: '2020-04-30',
    groupId: 'group-1',
    parentIds: ['parent-6'],
    photoPermission: true,
    allergies: ['Gluten'],
    emergencyContacts: [],
    pickupAuthorizations: [],
  },
  {
    id: 'child-7',
    firstName: 'Hannah',
    lastName: 'Richter',
    birthDate: '2021-09-12',
    groupId: 'group-1',
    parentIds: ['parent-7'],
    photoPermission: true,
    allergies: [],
    emergencyContacts: [],
    pickupAuthorizations: [],
  },
  {
    id: 'child-8',
    firstName: 'Luca',
    lastName: 'Klein',
    birthDate: '2020-02-28',
    groupId: 'group-1',
    parentIds: ['parent-8'],
    photoPermission: true,
    allergies: [],
    emergencyContacts: [],
    pickupAuthorizations: [],
  },
];

export const todayAttendance: AttendanceStatus[] = [
  { childId: 'child-1', status: 'present', checkInTime: '08:15' },
  { childId: 'child-2', status: 'absent', absenceType: 'sick' },
  { childId: 'child-3', status: 'present', checkInTime: '07:45' },
  { childId: 'child-4', status: 'late', checkInTime: '09:30' },
  { childId: 'child-5', status: 'present', checkInTime: '08:00' },
  { childId: 'child-6', status: 'absent', absenceType: 'vacation' },
  { childId: 'child-7', status: 'not_arrived' },
  { childId: 'child-8', status: 'present', checkInTime: '08:22' },
];

export const absences: Absence[] = [
  {
    id: 'absence-1',
    childId: 'child-2',
    type: 'sick',
    startDate: '2026-01-27',
    endDate: '2026-01-29',
    note: 'Erkältung mit Fieber',
    reportedBy: 'parent-2',
    reportedAt: '2026-01-27T07:30:00Z',
  },
  {
    id: 'absence-2',
    childId: 'child-6',
    type: 'vacation',
    startDate: '2026-01-27',
    endDate: '2026-02-02',
    note: 'Familienurlaub',
    reportedBy: 'parent-6',
    reportedAt: '2026-01-20T14:00:00Z',
  },
];

export const chats: Chat[] = [
  {
    id: 'chat-1',
    type: 'group',
    name: 'Sonnenkäfer Eltern',
    participants: ['user-1', 'parent-1', 'parent-2', 'parent-3'],
    lastMessage: {
      id: 'msg-1',
      senderId: 'parent-1',
      senderName: 'Familie Müller',
      senderRole: 'parent',
      content: 'Emma bringt morgen Muffins für alle mit!',
      timestamp: '2026-01-27T08:45:00Z',
      read: false,
    },
    unreadCount: 2,
  },
  {
    id: 'chat-2',
    type: 'direct',
    name: 'Familie Weber',
    participants: ['user-1', 'parent-2'],
    lastMessage: {
      id: 'msg-2',
      senderId: 'parent-2',
      senderName: 'Familie Weber',
      senderRole: 'parent',
      content: 'Leon hat heute Nacht schlecht geschlafen',
      timestamp: '2026-01-27T07:30:00Z',
      read: true,
    },
    unreadCount: 0,
  },
  {
    id: 'chat-3',
    type: 'direct',
    name: 'Familie Fischer',
    participants: ['user-1', 'parent-3'],
    lastMessage: {
      id: 'msg-3',
      senderId: 'user-1',
      senderName: 'Maria Schmidt',
      senderRole: 'educator',
      content: 'Mia hat heute super mitgemacht!',
      timestamp: '2026-01-26T15:20:00Z',
      read: true,
    },
    unreadCount: 0,
  },
];

export const pinnedPosts: PinnedPost[] = [
  {
    id: 'post-1',
    title: 'Faschingsfeier am 28. Februar',
    content: 'Liebe Eltern, am 28. Februar findet unsere große Faschingsfeier statt. Die Kinder dürfen verkleidet kommen. Bitte keine Waffen oder gruseligen Kostüme.\n\nWir freuen uns auf einen bunten und fröhlichen Tag mit allen Kindern!\n\nBitte beachten Sie:\n- Die Feier beginnt um 10:00 Uhr\n- Abholung ist bis 14:00 Uhr möglich\n- Bitte geben Sie den Kindern ein kleines Frühstück mit',
    author: 'Kita-Leitung',
    createdAt: '2026-01-25T10:00:00Z',
    important: true,
    groupIds: ['group-1', 'group-2'],
  },
  {
    id: 'post-2',
    title: 'Elternabend Termine',
    content: 'Die Elternabende für das Frühjahr finden am 15.02 (Sonnenkäfer) und 16.02 (Schmetterlinge) statt. Beginn jeweils 19:00 Uhr.\n\nThemen:\n- Rückblick auf das erste Halbjahr\n- Planung Sommerfest\n- Entwicklungsberichte\n\nWir bitten um Rückmeldung bis zum 10.02.',
    author: 'Kita-Leitung',
    createdAt: '2026-01-22T14:30:00Z',
    important: false,
    attachments: [
      { id: 'att-1', type: 'document', url: '#', name: 'Einladung_Elternabend.pdf' },
      { id: 'att-2', type: 'document', url: '#', name: 'Tagesordnung.pdf' }
    ],
    groupIds: ['group-1', 'group-2'],
  },
  {
    id: 'post-3',
    title: 'Neue Öffnungszeiten ab März',
    content: 'Ab 1. März gelten neue Öffnungszeiten: Mo-Fr 7:00 - 17:00 Uhr. Bei Fragen wenden Sie sich bitte an die Leitung.\n\nDie erweiterten Öffnungszeiten ermöglichen Ihnen mehr Flexibilität bei der Betreuung.',
    author: 'Kita-Leitung',
    createdAt: '2026-01-20T09:00:00Z',
    important: true,
    attachments: [
      { id: 'att-3', type: 'document', url: '#', name: 'Neue_Oeffnungszeiten.pdf' }
    ],
    groupIds: ['group-1', 'group-2'],
  },
  {
    id: 'post-4',
    title: 'Essensplan KW 05',
    content: 'Der neue Essensplan für die Kalenderwoche 05 ist verfügbar. Bei Allergien oder Unverträglichkeiten sprechen Sie bitte die Gruppenleitung an.',
    author: 'Küche',
    createdAt: '2026-01-27T08:00:00Z',
    important: false,
    attachments: [
      { id: 'att-4', type: 'document', url: '#', name: 'Essensplan_KW05.pdf' }
    ],
    groupIds: ['group-1', 'group-2'],
  },
  {
    id: 'post-5',
    title: 'Schließtage 2026',
    content: 'Bitte beachten Sie unsere Schließtage für das Jahr 2026. Die vollständige Liste finden Sie im angehängten Dokument.',
    author: 'Kita-Leitung',
    createdAt: '2026-01-15T10:00:00Z',
    important: false,
    attachments: [
      { id: 'att-5', type: 'document', url: '#', name: 'Schliesstage_2026.pdf' }
    ],
    groupIds: ['group-1', 'group-2'],
  },
];

export const calendarEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Faschingsfeier',
    description: 'Große Faschingsfeier mit Kostümen',
    startDate: '2026-02-28',
    allDay: true,
    type: 'event',
    groupIds: ['group-1', 'group-2'],
  },
  {
    id: 'event-2',
    title: 'Elternabend Sonnenkäfer',
    startDate: '2026-02-15T19:00:00',
    endDate: '2026-02-15T21:00:00',
    allDay: false,
    type: 'meeting',
    groupIds: ['group-1'],
  },
  {
    id: 'event-3',
    title: 'Kita geschlossen - Fortbildung',
    startDate: '2026-03-05',
    allDay: true,
    type: 'closure',
    groupIds: ['group-1', 'group-2'],
  },
  {
    id: 'event-4',
    title: 'Waldtag',
    description: 'Ausflug in den Stadtwald. Bitte wetterfeste Kleidung und festes Schuhwerk.',
    startDate: '2026-02-10',
    allDay: true,
    type: 'event',
    groupIds: ['group-1'],
  },
];

export const diaryEntries: DiaryEntry[] = [
  {
    id: 'diary-1',
    groupId: 'group-1',
    date: '2026-01-24',
    content: 'Heute haben wir bei schönstem Wetter den Garten erkundet. Die Kinder haben im Sandkasten gespielt und erste Frühblüher entdeckt. Nach dem Mittagessen gab es eine gemütliche Vorleserunde.',
    author: 'Maria Schmidt',
    photos: [],
    createdAt: '2026-01-24T15:00:00Z',
  },
  {
    id: 'diary-2',
    groupId: 'group-1',
    date: '2026-01-23',
    content: 'Kreativtag! Wir haben bunte Faschingsmasken gebastelt. Die Kinder waren mit viel Begeisterung dabei. Emma und Leon haben sogar Glitzer verwendet.',
    author: 'Maria Schmidt',
    photos: [],
    createdAt: '2026-01-23T14:45:00Z',
  },
];
