"use client"
import React, { useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { collection, getDocs, Timestamp } from "firebase/firestore";
import Item from './components/Item';
import AddNewDialouge from "./components/AddNewDialouge";
import DeleteDialouge from "./components/DeleteDialouge";
import { db } from "./firebase";

interface SiteInfoProps {
  siteID: string,
  siteName: string;
  siteUrl: string;
  imageUrl: string;
  isEnabled: boolean;
  siteMessage: string;
  createdAt: Timestamp;
}

interface deleteDialougeProps {
  isOpen: boolean;
  siteID: string;
}

export default function Page() {
  const [siteList, setSiteList] = useState<SiteInfoProps[]>([]);
  const [isAddNewDialouge, setAddNewDialouge] = useState<boolean>(false);
  const [deleteDialouge, setDeleteDialouge] = useState<deleteDialougeProps>({
    isOpen: false,
    siteID: ""
  });
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    }
  });

  const getSiteList = async () => {
    try {
      const siteListSnapshot = await getDocs(collection(db, 'siteinfo'));
      const data: SiteInfoProps[] = siteListSnapshot.docs.map((doc) => doc.data() as SiteInfoProps);
      setSiteList(data);
    } catch (error) {
      console.error('Error fetching site list:', error);
    }
  }
  
  useEffect(() => {
    getSiteList();
  }, []);

  return ( 
    <section className="mt-20">
      <div className="flex justify-between items-center">
        <p className="text-xl text-blue-500 font-semibold">Site List</p>
        <div className="flex space-x-3 items-center">
          <p className="ml-auto">Login ID: {session?.user?.name}</p>
          <button onClick={() => signOut()} className="block py-1 px-2 bg-red-600 text-white hover:bg-red-800 transition-all rounded">Log Out</button>
          <button onClick={() => setAddNewDialouge(true)} className="block py-1 px-2 bg-violet-700 text-white hover:bg-violet-900 transition-all rounded">Add new</button>
        </div>
      </div>
      

      <AddNewDialouge isOpen={isAddNewDialouge} setAddNewDialouge={setAddNewDialouge} getSiteList={getSiteList} />
      <DeleteDialouge deleteDialouge={deleteDialouge} setDeleteDialouge={setDeleteDialouge} getSiteList={getSiteList} />

      {siteList.length < 1 ? (
        <div className="w-full h-48 flex items-center justify-center">
          <p>No site list added.</p>
        </div>
      ) : (
        <ul className="w-full mt-10 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {siteList.map((e, k) => (
            <Item key={k} e={e} getSiteList={getSiteList} setDeleteDialouge={setDeleteDialouge} />
          ))}
        </ul>
      )}
    </section>
  );
}

