import 'server-only'

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import { DefaultDataTypes } from "../lib/defaultData";

export default async function getData() {
    const siteListSnapshot = await getDocs(query(collection(db, 'siteinfo'), orderBy("createdAt", "desc")));

    return siteListSnapshot.docs.map((doc) => doc.data() as DefaultDataTypes);
}