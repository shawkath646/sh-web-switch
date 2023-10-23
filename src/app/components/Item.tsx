import { FormEvent, useRef, useState } from "react";
import Image from "next/image";
import { useSession } from 'next-auth/react';
import Moment from "react-moment";
import noLogo from '../assets/noLogo.png'
import { doc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import { AiOutlineCloudUpload, AiFillPicture } from 'react-icons/ai';
import { CgSpinner } from 'react-icons/cg';
import { MdDelete } from 'react-icons/md';

interface ItemProps {
  e: {
    siteID: string,
    siteName: string;
    siteUrl: string;
    imageUrl: string;
    isEnabled: boolean;
    siteMessage: string;
    createdAt: Timestamp;
  };
  getSiteList: () => void;
  setDeleteDialouge: (e: any) => void;
}

const Item = ({ e, getSiteList, setDeleteDialouge }: ItemProps) => {
  const [isEnabled, setEnable] = useState<boolean>(e.isEnabled);
  const [siteMessage, setMessages] = useState<string>(e.siteMessage);
  const [siteLogo, setSiteLogo] = useState<File | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const { data: session } = useSession();

  const hiddenLogoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoInputClick = () => {
    if (hiddenLogoInputRef.current != null) hiddenLogoInputRef.current.click();
  }

  const handleSiteLogo = (e: any) => {
    if (!e.target.files) return;
    setSiteLogo(e.target.files[0])
  }

  const handleSubmit = async(event: FormEvent) => {
    event.preventDefault();
    if (session?.user?.name === "Guest") return;
    setLoading(true);
    try {
      let imageUrl = e.imageUrl;
      const storageRef = ref(storage, `images/${e.siteName}`);
      if (siteLogo) {
        if (e.imageUrl) {
          await deleteObject(storageRef);
        }
        await uploadBytes(storageRef, siteLogo);
        imageUrl = await getDownloadURL(storageRef);
      }
      const docRef = doc(db, 'siteinfo', e.siteName);
      await setDoc(docRef, {
        imageUrl,
        isEnabled,
        siteMessage,
        createdAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    getSiteList();
  }

    return (
        <li className="space-y-3 border border-gray-900 p-5 rounded bg-black bg-opacity-50 backdrop-blur-xl drop-shadow-lg w-[460px] mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Image src={e.imageUrl || noLogo.src} alt="site logo" height={30} width={30} />
                    <p className="font-semibold text-xl text-teal-500">{e.siteName} <span className="text-sm truncate">({e.siteUrl})</span></p>
                  </div>
                  <div>
                    <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="isEnabled" checked={isEnabled} onChange={() => setEnable((state) => !state)} value="" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full  after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <input type="file" ref={hiddenLogoInputRef} accept="image/*" onChange={handleSiteLogo} hidden />
                  
              </div>
              <section className="space-y-5">
                  <div className="space-y-2 mt-3">
                    <label htmlFor="siteMessage" className="font-medium">Message :</label>
                    <input type="text" id="siteMessage" disabled={!isEnabled} value={siteMessage} onChange={(e) => setMessages(e.target.value)} className={`bg-transparent outline-none w-full pb-1 transition-all border-blue-500 h-8 ${isEnabled ? "border-b-[1.5px]" : ""}`} />
                  </div>
                  <p className="text-yellow-400 truncate">{e.imageUrl || (siteLogo && siteLogo.name) || "No image"}</p>
                  <Moment date={e.createdAt?.toDate()} fromNow className="text-sm mt-5" />
                  <div className="flex items-center space-x-2">
                    <button type="button" onClick={() => setDeleteDialouge({ isOpen: true, siteID: e.siteID })} className="px-2 py-1 rounded disabled:bg-gray-500 text-white bg-red-500 hover:bg-red-700 transition-all flex items-center space-x-1">
                      <MdDelete size="lg" className="h-4 w-4" />
                      <p>Delete</p>
                    </button>
                    <button type="button" onClick={handleLogoInputClick} className="px-2 py-1 rounded disabled:bg-gray-500 text-white bg-emerald-500 hover:bg-emerald-700 transition-all flex items-center space-x-1">
                      <AiFillPicture size="lg" className="h-4 w-4" />
                      <p>Update Logo</p>
                    </button>
                    <button type="submit" disabled={isLoading || (isEnabled == e.isEnabled && siteMessage == e.siteMessage) && !siteLogo} className="px-2 py-1 rounded disabled:bg-gray-500 text-white bg-blue-500 hover:bg-blue-700 transition-all flex items-center space-x-1">
                      {isLoading ? <CgSpinner size="lg" className="h-4 w-4 animate-spin" /> : <AiOutlineCloudUpload size="lg" className="h-4 w-4" />}
                      <p>{isLoading ? "Updating..." : "Update"}</p>
                    </button>
                  </div>
              </section>
            </form>
        </li>
    );
}

export default Item;