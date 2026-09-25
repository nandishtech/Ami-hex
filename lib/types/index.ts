// ============================================================
// RESQFOOD TypeScript Types & Domain Models
// ============================================================

export type UserRole = "DONOR" | "RECIPIENT" | "DRIVER" | "ADMIN";

export type OrgType =
  | "RESTAURANT"
  | "HOTEL"
  | "GROCERY"
  | "CATERER"
  | "CAFETERIA"
  | "EVENT"
  | "NGO"
  | "SHELTER"
  | "FOOD_BANK"
  | "COMMUNITY_KITCHEN"
  | "CORPORATE"
  | "GOVERNMENT";

export type DonationStatus =
  | "DRAFT"
  | "POSTED"
  | "MATCHING"
  | "MATCHED"
  | "ASSIGNED"
  | "PICKUP_PENDING"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED"
  | "EXPIRED";

export type RescueStatus =
  | "MATCHED"
  | "DRIVER_ACCEPTED"
  | "ARRIVED_PICKUP"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "ARRIVED_DESTINATION"
  | "DELIVERED"
  | "CANCELLED";

export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type StorageCondition =
  | "ROOM_TEMP"
  | "REFRIGERATED"
  | "FROZEN"
  | "HOT_HELD";

export type FoodCategory =
  | "Prepared Meals"
  | "Bakery"
  | "Produce"
  | "Dairy"
  | "Packaged"
  | "Canned"
  | "Beverages";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organizationId?: string;
  organizationName?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface OrganizationModel {
  id: string;
  name: string;
  type: OrgType;
  logo?: string;
  description?: string;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  phone?: string;
  email?: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface BranchModel {
  id: string;
  organizationId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  operatingHours?: string;
  capacity: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface RecipientProfileModel {
  id: string;
  userId: string;
  organizationId?: string;
  capacity: number; // in kg
  currentNeeds: NeedItem[];
  foodPreferences: string[];
  operatingHours: string;
  availabilityStatus: "OPEN" | "FULL" | "CLOSED";
}

export interface NeedItem {
  category: FoodCategory;
  urgency: "LOW" | "MEDIUM" | "HIGH";
  neededKg: number;
  receivedKg: number;
}

export interface DriverProfileModel {
  id: string;
  userId: string;
  name: string;
  phone: string;
  vehicleType: "CAR" | "VAN" | "BIKE" | "EV_CAR" | "CARGO_BIKE";
  vehicleCapacity: number; // in kg
  availability: "AVAILABLE" | "BUSY" | "OFFLINE";
  currentLatitude: number;
  currentLongitude: number;
  serviceRadius: number; // in km
  verificationStatus: "VERIFIED" | "PENDING";
  lastLocationUpdate: string;
}

export interface DonationModel {
  id: string;
  donorId: string;
  donorName?: string;
  organizationId?: string;
  organizationName?: string;
  foodName: string;
  category: FoodCategory;
  quantity: number;
  unit: "KG" | "TRAYS" | "BOXES" | "PORTIONS";
  estimatedMeals: number;
  preparedAt: string;
  availableUntil: string;
  storageCondition: StorageCondition;
  pickupAddress: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  notes?: string;
  status: DonationStatus;
  urgencyLevel: UrgencyLevel;
  createdAt: string;
  updatedAt: string;
  allergens?: string[];
}

export interface MatchModel {
  id: string;
  donationId: string;
  donation?: DonationModel;
  recipientId: string;
  recipientName: string;
  recipientAddress: string;
  recipientLat: number;
  recipientLng: number;
  driverId?: string;
  driverName?: string;
  score: number;
  distance: number; // in km
  estimatedTime: number; // in minutes
  status: "PROPOSED" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  createdAt: string;
  scoreBreakdown: {
    urgencyScore: number; // max 25
    distanceScore: number; // max 25
    capacityScore: number; // max 20
    compatibilityScore: number; // max 15
    driverScore: number; // max 15
    explanation: string[];
  };
}

export interface RescueModel {
  id: string;
  donationId: string;
  donation?: DonationModel;
  matchId?: string;
  recipientId: string;
  recipientName: string;
  recipientAddress: string;
  recipientLat: number;
  recipientLng: number;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverVehicle?: string;
  driverLat?: number;
  driverLng?: number;
  status: RescueStatus;
  rescueScore: number;
  estimatedPickupTime?: string;
  estimatedDeliveryTime?: string;
  actualPickupTime?: string;
  actualDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
  route?: RouteModel;
  pickupVerification?: PickupVerificationModel;
  deliveryVerification?: DeliveryVerificationModel;
  impact?: ImpactRecordModel;
}

export interface RouteModel {
  id: string;
  rescueId: string;
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
  distance: number; // km
  estimatedDuration: number; // mins
  trafficStatus: "NORMAL" | "MODERATE" | "HEAVY";
  waypoints: [number, number][]; // [lat, lng] path
}

export interface PickupVerificationModel {
  id: string;
  rescueId: string;
  status: "CONFIRMED";
  timestamp: string;
  latitude: number;
  longitude: number;
  qrCode: string;
  photoUrl?: string;
  notes?: string;
}

export interface DeliveryVerificationModel {
  id: string;
  rescueId: string;
  status: "CONFIRMED";
  timestamp: string;
  latitude: number;
  longitude: number;
  qrCode: string;
  photoUrl?: string;
  recipientConfirmation: string;
}

export interface ImpactRecordModel {
  id: string;
  rescueId: string;
  foodWeight: number; // kg
  estimatedMeals: number;
  estimatedCo2e: number; // kg CO2e
  organizationsSupported: number;
  waterSavedLitres: number;
  methodologyVersion: string;
  createdAt: string;
}

export interface NotificationModel {
  id: string;
  userId: string;
  type: "RESCUE" | "CRITICAL" | "SYSTEM" | "IMPACT" | "REMATCH";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLogModel {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface AIInsightModel {
  id: string;
  organizationId: string;
  type: "SURPLUS_FORECAST" | "ROUTE_OPTIMIZATION" | "DEMAND_SPIKE" | "SPOILAGE_ALERT";
  title: string;
  description: string;
  confidence: number;
  createdAt: string;
}

// API Result Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
