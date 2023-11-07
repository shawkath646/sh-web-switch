import { Timestamp } from "firebase/firestore";

export interface DefaultDataTypes {
  siteID: string,
  siteName: string;
  siteUrl: string;
  siteMessage: string;
  siteData: string;
  imageUrl: string;
  isEnabled: boolean;
  createdAt: Timestamp | {
    seconds: number,
    nanoseconds : number
  } | Date;
}

export interface DefaultFormDataTypes {
  siteID: string,
  siteName: string;
  siteUrl: string;
  siteMessage: string;
  siteData: string;
  imageUrl: string;
  isEnabled: boolean;
  createdAt: Timestamp | {
    seconds: number,
    nanoseconds : number
  } | Date;
  selectedFile: File | null,
  base64Image: string
}

export interface SignInFormDataTypes {
  username: string;
  password: string;
}

export interface UploadDataPropsTypes {
  data: any;
  siteID: string;
  imageStatus: string;
}