"use server";
import { collection, deleteDoc, doc, getDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "./firebase";

export default async function deleteData(siteID: string, imageUrl: string) {

    const storageRef = ref(storage, `images/${siteID}`);
    const docRef = doc(collection(db, 'siteinfo'), siteID);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return { type: false, status: "Site ID is not exists on server" };

    await deleteDoc(docRef);

    if (imageUrl) await deleteObject(storageRef);

    return { type: true, status: "Succesfully deleted" };
}