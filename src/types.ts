export type TabType = 'home' | 'map' | 'services' | 'events' | 'profile';

export type MapMode = '3d' | '2d';

export interface Classroom {
  id: string;
  roomNumber: string;
  name: string;
  buildingId: string;
  floor: number;
  capacity: number;
  type: 'Lecture Hall' | 'Computer Lab' | 'Hardware Lab' | 'Seminar Hall' | 'Drawing Hall' | 'Faculty Office';
  currentStatus: 'Occupied' | 'Available' | 'Reserved';
  currentClass?: string;
  instructor?: string;
  timeSlot?: string;
  amenities: string[];
  coordinates: { x: number; y: number; z: number };
}

export interface Building {
  id: string;
  name: string;
  code: string;
  category: 'Academic' | 'Administrative' | 'Hostel' | 'Dining' | 'Sports' | 'Recreation' | 'Library';
  description: string;
  floors: number;
  position: [number, number, number]; // [x, y, z] for 3D Three.js
  dimensions: [number, number, number]; // [width, height, depth]
  color: string;
  iconName: string;
  popularSpots: string[];
  classrooms: Classroom[];
  openingHours: string;
  contactPerson: string;
}

export interface Canteen {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  timings: string;
  crowdLevel: 'Low' | 'Moderate' | 'High';
  crowdPercentage: number;
  tags: string[];
  description: string;
  menu: {
    category: string;
    items: {
      id: string;
      name: string;
      price: number;
      isVeg: boolean;
      isSpecial?: boolean;
      calories?: string;
    }[];
  }[];
}

export interface BusRoute {
  id: string;
  routeNumber: string;
  name: string;
  startPoint: string;
  destination: string;
  via: string[];
  morningTimings: string[];
  eveningTimings: string[];
  status: 'On Time' | 'Delayed 5m' | 'Boarding' | 'In Transit';
  driverName: string;
  driverPhone: string;
  capacity: number;
  occupiedSeats: number;
}

export interface BusRegistration {
  id: string;
  studentName: string;
  studentId: string;
  routeId: string;
  stopName: string;
  passType: 'Semester Pass' | 'Annual Pass' | 'Monthly Pass';
  fee: number;
  qrCode: string;
  validUntil: string;
  paymentStatus: 'Paid' | 'Pending';
}

export interface CampusEvent {
  id: string;
  title: string;
  category: 'EVENT' | 'WORKSHOP' | 'SPORTS' | 'CULTURAL' | 'TECH';
  date: string;
  time: string;
  venue: string;
  image: string;
  organizer: string;
  description: string;
  seatsTotal: number;
  seatsLeft: number;
  fee: string;
  isRegistered?: boolean;
  speakerOrHost?: string;
  eligibility: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  tag: 'ON CAMPUS' | 'ACADEMIC' | 'SCHOLARSHIP' | 'PLACEMENT';
  timeAgo: string;
  date: string;
  image: string;
  summary: string;
  fullText: string;
  author: string;
}

export interface NotificationItem {
  id: string;
  category: 'ACADEMIC UPDATES' | 'SOCIAL UPDATES';
  type: 'NEW GRADE' | 'LIBRARY DUE' | 'CLUB EVENT' | 'SOCIAL' | 'BUS ALERT';
  title: string;
  description: string;
  timeAgo: string;
  isUnread: boolean;
  iconType: 'grade' | 'clock' | 'club' | 'music' | 'bus';
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  shelfLocation: string;
  floor: string;
  category: string;
  availableCopies: number;
  totalCopies: number;
  coverImage?: string;
  status: 'Available' | 'Issued' | 'Reference Only';
}

export interface HostelRoom {
  block: string;
  roomType: 'Single Ac' | 'Double Non-AC' | 'Triple Non-AC' | 'Deluxe 2-Sharing';
  feePerSemester: number;
  availableRooms: number;
  wardenName: string;
  wardenContact: string;
  amenities: string[];
}

export interface StudentProfile {
  userId?: string;
  name: string;
  rollNo: string;
  program: string;
  semester: string;
  department: string;
  email: string;
  photoURL?: string;
  isGoogleLinked?: boolean;
  hostelBlock?: string;
  hostelRoom?: string;
  busPassNumber?: string;
  libraryCardId: string;
  attendance: number;
  cgpa: number;
}
