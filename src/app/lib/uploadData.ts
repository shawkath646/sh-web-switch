"use server";
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadString } from "firebase/storage";
import { UploadDataPropsTypes } from "./defaultData";
import { db, storage } from "./firebase";

export default async function uploadData({ data, siteID, imageStatus }: UploadDataPropsTypes ) {

    const isModifying = siteID ? siteID.length >= 1 : false; // Checking if data is updating or new
    
    data.createdAt = serverTimestamp(); // Getting operation time

    delete data.selectedFile;
    data.imageUrl = data.base64Image;
    delete data.base64Image;

    try {
        if (isModifying) { // If site data is updating
            
            const storageRef = ref(storage, `images/${data.siteID}`);

            // Image condition

            if (imageStatus === "added") {

                // added
                await uploadString(storageRef, data.imageUrl, 'base64');
                data.imageUrl = await getDownloadURL(storageRef);
            } else if (imageStatus === "updated") {

                console.log("updated");
                // updated
                await deleteObject(storageRef);
                await uploadString(storageRef, data.imageUrl, 'base64');
                data.imageUrl = await getDownloadURL(storageRef);
            }
            
            await updateDoc(doc(db, 'siteinfo', data.siteID), data, { merge: true }); // Updating data to server

        } else { // If site data is new
            
            if (data.siteID.length > 1) { // If siteID is custom

                // Getting data from server
                const storageRef = ref(storage, `images/${data.siteID}`);
                const docRef = doc(collection(db, 'siteinfo'), data.siteID);
                const docSnap = await getDoc(docRef);

                // Checking if siteID is already exixts
                if (docSnap.exists()) return { type: false, status: "Site ID is already exists on server" };

                if (data.imageUrl) { // Checking if image selected
                    await uploadString(storageRef, data.imageUrl, 'base64');
                    data.imageUrl = await getDownloadURL(storageRef);
                }
                
                await setDoc(docRef, data); // Set data to server

            } else { // If siteID is auto generated
                
                const docRef = await addDoc(collection(db, 'siteinfo'), data);

                data.siteID = docRef.id; // Getting auto generated siteID

                if (data.imageUrl) { // Checking if image selected
                    const storageRef = ref(storage, `images/${data.siteID}`);
                    await uploadString(storageRef, data.imageUrl, 'base64');
                    data.imageUrl = await getDownloadURL(storageRef);
                }
                await updateDoc(doc(db, 'siteinfo', docRef.id), data, { merge: true }); // Updating data to server
            }
        }
        
    } catch (error: any) {
        return { type: false, status: error.toString()}
    }
    return { type: true, status: "Site added successfully" }
}
