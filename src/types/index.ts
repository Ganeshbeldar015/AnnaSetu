export type UserRole = 'farmer' | 'operator' | 'admin' | 'public';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  kisanCardId?: string;
  employeeId?: string;
  assignedCenter?: string;
}

export type QueueStage = 
  | 'booked'                  // Slot Confirmed
  | 'checked_in'               // Scanned at Gate
  | 'in_queue'                 // In Waiting Bay
  | 'called'                   // Token Called to Counter
  | 'weighing_qc'              // Moisture & Weight Inspection
  | 'procurement_completed'    // E-J Form generated
  | 'payment_processing'       // Bank Mandate sent to PFMS
  | 'payment_completed'        // DBT Credited to Account
  | 'late_arrival'
  | 'cancelled';

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  aadhaarMasked: string;
  state: string;
  district: string;
  village: string;
  landSurveyNo: string;
  landAcreage: number;
  kisanCardId: string;
  bankName: string;
  accountMasked: string;
  ifscCode: string;
}

export interface CropInfo {
  id: string;
  name: string;
  variety: string;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  mspRatePerQuintal: number; // in INR
  standardMoisturePercent: number; // standard benchmark e.g. 14%
  maxPermissibleMoisture: number; // max limit e.g. 17%
  icon: string;
}

export interface ProcurementCenter {
  id: string;
  name: string;
  code: string;
  district: string;
  state: string;
  address: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  totalCounters: number;
  activeCounters: number;
  dailyCapacityQuintals: number;
  dailyProcuredQuintals: number;
  currentQueueCount: number;
  avgWaitTimeMinutes: number;
  loadStatus: 'normal' | 'busy' | 'high_load' | 'full';
  contactPerson: string;
  contactPhone: string;
  nextAvailableSlot: string;
}

export interface TimeSlot {
  id: string;
  centerId: string;
  date: string; // YYYY-MM-DD
  timeWindow: string; // e.g. "10:30 AM – 11:00 AM"
  maxCapacity: number;
  bookedCount: number;
  isFull: boolean;
}

export interface QCInspection {
  moisturePercent: number;
  foreignMatterPercent: number;
  brokenGrainsPercent: number;
  grade: 'Grade A (MSP Premium)' | 'FAQ (Standard MSP)' | 'Below FAQ';
  baseMspRate: number;
  moistureDeductionRate: number;
  netRatePerQuintal: number;
  actualQuantityQuintals: number;
  grossAmount: number;
  deductionsAmount: number;
  netPayableAmount: number;
  inspectorName: string;
  counterNumber: string;
  weighmentSlipNo: string;
  inspectedAt: string;
}

export interface PaymentRecord {
  paymentId: string;
  utrNumber: string;
  amount: number;
  status: 'Pending Verification' | 'Mandate Initiated' | 'PFMS Clearing' | 'DBT Credited';
  bankName: string;
  accountMasked: string;
  ifscCode: string;
  initiatedAt: string;
  creditedAt?: string;
  pfmsReference: string;
}

export interface BookingToken {
  id: string;
  tokenNumber: string; // e.g. "A-024"
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerVillage: string;
  farmerDistrict: string;
  centerId: string;
  centerName: string;
  cropId: string;
  cropName: string;
  expectedQuantityQuintals: number;
  actualQuantityQuintals?: number;
  date: string;
  timeSlot: string;
  stage: QueueStage;
  queuePosition: number;
  estimatedWaitMinutes: number;
  counterAssigned?: string;
  bookedAt: string;
  checkedInAt?: string;
  calledAt?: string;
  completedAt?: string;
  qcDetails?: QCInspection;
  paymentDetails?: PaymentRecord;
  qrTokenPayload: string;
}

export interface SimulatedNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'sms' | 'app' | 'system' | 'alert';
  isRead: boolean;
  relatedToken?: string;
}

export interface SmartRecommendation {
  id: string;
  type: 'congestion' | 'reroute' | 'counter_expansion' | 'weather_alert';
  title: string;
  centerId: string;
  centerName: string;
  description: string;
  suggestedAction: string;
  status: 'active' | 'applied' | 'dismissed';
  impactMetric: string;
  timestamp: string;
}

export interface SmartJourneyPlan {
  originLocation: string;
  originDistrict: string;
  destinationCenter: string;
  destinationDistrict: string;
  estimatedDistanceKm: number;
  estimatedTravelMinutes: number;
  estimatedTravelFormatted: string; // e.g. "3 hrs" or "1.5 hrs" or "25 mins"
  procurementSlot: string; // e.g. "2:00 PM – 2:30 PM"
  slotStartTime: string; // e.g. "2:00 PM"
  safetyBufferMinutes: number; // e.g. 30
  recommendedDepartureTime: string; // e.g. "10:30 AM"
  expectedArrivalTime: string; // e.g. "1:30 PM"
  expectedProcurementTime: string; // e.g. "Around 2:00 PM"
  isPractical: boolean;
  warningMessage?: string;
  explanation: string;
}

