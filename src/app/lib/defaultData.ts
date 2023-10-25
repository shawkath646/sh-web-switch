import { FieldValue, Timestamp, serverTimestamp } from "firebase/firestore";

export interface DefaultDataTypes {
  siteID: string,
  siteName: string;
  siteUrl: string;
  siteMessage: string;
  siteData: string;
  imageUrl: string;
  isEnabled: boolean;
  createdAt: Timestamp | FieldValue;
}


export interface AddNewDialougePropsTypes {
  addNewDialouge: {
    isOpen: boolean;
    siteRawData: DefaultDataTypes;
  };
  setAddNewDialouge: (newState: { isOpen: boolean, siteRawData: DefaultDataTypes }) => void;
  getSiteList: () => void;
}

export interface ItemPropsType {
  e: DefaultDataTypes;
  setAddNewDialouge: (newState: { isOpen: boolean, siteRawData: DefaultDataTypes }) => void;
  setDeleteDialouge: (newState: { isOpen: boolean, siteID: string, imageUrl: string }) => void;
}

export interface UpdateDocWithID {
  siteID: string,
  imageUrl: string,
}


export const defaultBlankData = {
  siteID: '',
  siteName: '',
  siteUrl: '',
  siteMessage: '',
  siteData: '',
  imageUrl: '',
  isEnabled: true,
  createdAt: serverTimestamp(),
}
