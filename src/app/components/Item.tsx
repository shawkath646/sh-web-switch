import Link from "next/link";
import Image from "next/image";
import Moment from "react-moment";
import { defaultBlankData, ItemPropsType}from "../lib/defaultData";
import noLogo from '../assets/noLogo.png'
import { AiOutlineEdit } from 'react-icons/ai';
import { BsArrowRight } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { Timestamp } from "firebase/firestore";
import StylistButton from "./MEXTUI/StylistButton";


const Item = ({ e, setAddNewDialouge, setDeleteDialouge }: ItemPropsType) => {

  let createdAtDate: Date | null = null;

  if (e.createdAt instanceof Timestamp) {
    createdAtDate = e.createdAt.toDate();
  }

  const momentDate = createdAtDate !== null ? createdAtDate : undefined;

  return (
    <li className="space-y-3 border border-gray-900 p-5 rounded bg-black bg-opacity-50 backdrop-blur-xl drop-shadow-lg w-[460px] mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image src={e.imageUrl || noLogo.src} alt="site logo" height={30} width={30} />
          <p className="font-semibold text-xl text-teal-500 truncate w-[350px]">{e.siteName} <span className="text-sm">({e.siteUrl})</span></p>
        </div>
        <div>
          <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" id="isEnabled" readOnly checked={e.isEnabled} onChange={() => {}} value="" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full  after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      <p>Site ID: {e.siteID}</p>
      <section className="space-y-5">
        <div className="space-y-2 mt-3">
          <p className="font-medium">Message :</p>
          <p className="h-[25px]">{e.siteMessage}</p>
        </div>
        <p className="text-yellow-400 truncate">{e.imageUrl || "No image"}</p>
        
        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-2">
            <StylistButton onClick={() => setDeleteDialouge({ isOpen: true, siteID: e.siteID, imageUrl: e.imageUrl })} label="Delete" size="sm" bgColor="#d60927" space={3} bgColorOnHover="#a3051d" childrenBeforeLabel>
              <MdDelete size={16} />
            </StylistButton>

            <StylistButton onClick={() => setAddNewDialouge({ isOpen: true, siteRawData: e })}  label="Modify" size="sm" bgColor="#0d9488" space={3} bgColorOnHover="#0c7067" childrenBeforeLabel>
              <AiOutlineEdit size={16} />
            </StylistButton>

            <Link href={e.siteUrl} target="_blank">
              <StylistButton label="Visit" size="sm" bgColor="#2b6cb0" space={6} bgColorOnHover="#1b4c80">
                <BsArrowRight size={16} />
              </StylistButton>
            </Link>
          </div>

          <Moment date={momentDate} fromNow className="text-sm" />
        </div>
      </section>
    </li>
  );
}

export default Item;