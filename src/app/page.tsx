"use client"
import React, { useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { collection, getDocs } from "firebase/firestore";
import { defaultBlankData, DefaultDataTypes } from "./lib/defaultData";
import Item from './components/Item';
import AddNewDialouge from "./components/AddNewDialouge";
import DeleteDialouge from "./components/DeleteDialouge";
import { db } from "./lib/firebase";
import StylistButton from "./components/MEXTUI/StylistButton";
import { AiFillPlusCircle } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";




export default function Page() {
  const [siteList, setSiteList] = useState<DefaultDataTypes[]>([]);
  const [addNewDialouge, setAddNewDialouge] = useState({
    isOpen: false,
    siteRawData: defaultBlankData
  });
  const [deleteDialouge, setDeleteDialouge] = useState({
    isOpen: false,
    siteID: "",
    imageUrl: "",
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
      const data: DefaultDataTypes[] = siteListSnapshot.docs.map((doc) => doc.data() as DefaultDataTypes);
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
        <p className="text-sm truncate">Login ID: {session?.user?.name}</p>
        <div className="flex items-center space-x-2 ml-auto">
          <StylistButton onClick={() => signOut()} label="Log Out" size="sm" bgColor="#7d0acf" space={3} bgColorOnHover="#5b0896">
            <BiLogOut size={16} />
          </StylistButton>
          <StylistButton onClick={() => setAddNewDialouge({ isOpen: true, siteRawData: defaultBlankData })} label="Add new" size="sm" bgColor="#0f76d6" space={3} bgColorOnHover="#0b5aa3" childrenBeforeLabel>
            <AiFillPlusCircle size={16} />
          </StylistButton>
        </div>
      </div>

      <p className="text-2xl text-blue-300 mt-10 lg:mt-0">Site List</p>
        
      

      <AddNewDialouge addNewDialouge={addNewDialouge} setAddNewDialouge={setAddNewDialouge} getSiteList={getSiteList} />
      <DeleteDialouge deleteDialouge={deleteDialouge} setDeleteDialouge={setDeleteDialouge} getSiteList={getSiteList} />

      {siteList.length < 1 ? (
        <div className="w-full h-48 flex items-center justify-center">
          <p>No site list added.</p>
        </div>
      ) : (
        <ul className="w-full mt-10 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {siteList.map((e, k) => (
            <Item key={k} e={e} setAddNewDialouge={setAddNewDialouge} setDeleteDialouge={setDeleteDialouge} />
          ))}
        </ul>
      )}
    </section>
  );
}

