import { UserInfo } from './user-info.model';

export interface Property {
  id: number;
  userEmail: string;
  propertyType: string;
  isSharedProperty: boolean;
  address: string;
  city: string;
  state: string;
  area: number;
  leaseType: string;
  rentAmount: number;
  isNegotiable: boolean;
  isFurnished: boolean;
  title: string;
  description: string;
  images: string[];
  imageFiles?: Array<File>;
  comments: Array<{ user: UserInfo; comment: string }>;
  amenities?: string[];
}
