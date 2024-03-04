import { Photo } from "./photo.model";

export interface Post {
    id: number;
    title: string;
    token: string;
    photoUrl: string;
    contentPost: string;
    createdAt: Date;
    updatedAt: Date;
    roomPrice: number;
    address: string;
    area: string;
    square: number;
    roomStatus: string;
    priceCategory: string;
    parking: boolean;
    wifi: boolean;
    conditioner: boolean;
    photos: Photo[];
  }
