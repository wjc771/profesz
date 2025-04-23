export type PropertyType = 'apartment' | 'house' | 'commercial' | 'land' | 'other' | 'plan' | 'material';

export type TransactionType = 'sale' | 'rent' | 'free' | 'premium';

export interface PropertyLocation {
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  lat?: number;
  lng?: number;
}

export interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  area: number;
  hasPool?: boolean;
  isFurnished?: boolean;
  hasElevator?: boolean;
  petsAllowed?: boolean;
  hasGym?: boolean;
  hasBalcony?: boolean;
  condominium?: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  transactionType: TransactionType;
  price: number;
  propertyTax?: number;
  location: PropertyLocation;
  features: PropertyFeatures;
  images: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isPremium?: boolean;
}

export interface PropertyDemand {
  id: string;
  userId: string;
  transactionType: TransactionType;
  propertyTypes: PropertyType[];
  priceRange: {
    min: number;
    max: number;
  };
  locationPreferences: {
    cities: string[];
    neighborhoods?: string[];
    states: string[];
  };
  featureRequirements: Partial<PropertyFeatures>;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface PropertyMatch {
  id: string;
  propertyId?: string;
  demandId: string;
  score: number;
  createdAt: string;
  viewed: boolean;
  contacted: boolean;
  property?: Property;
}
