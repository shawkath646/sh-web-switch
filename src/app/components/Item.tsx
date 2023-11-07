import 'server-only'
import Link from "next/link";
import Image from "next/image";
import moment from 'moment';
import noLogo from '../assets/noLogo.png';
import { DefaultDataTypes } from "../lib/defaultData";
import { AiOutlineEdit } from 'react-icons/ai';
import { BsArrowRight } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import StylistButton from "./MEXTUI/StylistButton";
import CopyButton from "./CopyButton";



const Item = ({ e }: { e: DefaultDataTypes }) => {

  const createdAtDate = moment(e.createdAt, "YYYYMMDD").fromNow();

  return (
    <li className="space-y-3 border border-gray-900 p-5 rounded bg-black bg-opacity-50 w-[430px] md:w-[460px] mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image src={e.imageUrl || noLogo.src} alt="site logo" height={30} width={30} />
          <p className="font-semibold text-xl text-teal-500 truncate w-[350px]">{e.siteName} <br /> <span className="text-sm">({e.siteUrl})</span></p>
        </div>
        <div>
          <label className="relative inline-flex items-center">
          <input type="checkbox" id="isEnabled" readOnly checked={e.isEnabled} value="" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full  after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <p><span  className="text-yellow-400">Site ID:</span> {e.siteID}</p>
        <CopyButton e={e.siteID} />
      </div>
      <section className="space-y-5">
        <div className="space-y-2 mt-3">
          <p className="font-medium truncate"><span  className="text-yellow-400">Message :</span> {e.siteMessage}</p>
        </div>
        <p className="truncate"><span className="text-yellow-400">Image URL :</span> {e.imageUrl || "No image"}</p>
        
        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-2">

            <Link href={`/delete?siteID=${e.siteID}&imageUrl=${e.imageUrl}`}>
              <StylistButton label="Delete" size="sm" bgColor="#d60927" space={3} bgColorOnHover="#a3051d" childrenBeforeLabel>
                <MdDelete size={16} />
              </StylistButton>
            </Link>

            <Link href={`/new?siteID=${e.siteID}&siteName=${e.siteName}&siteURL=${e.siteUrl}&siteMessage=${e.siteMessage}&siteData=${e.siteData}&isEnabled=${e.isEnabled}&imageURL=${e.imageUrl}`}>
              <StylistButton label="Modify" size="sm" bgColor="#0d9488" space={3} bgColorOnHover="#0c7067" childrenBeforeLabel>
                <AiOutlineEdit size={16} />
              </StylistButton>
            </Link>

            <Link href={e.siteUrl} target="_blank">
              <StylistButton label="Visit" size="sm" bgColor="#2b6cb0" space={6} bgColorOnHover="#1b4c80">
                <BsArrowRight size={16} />
              </StylistButton>
            </Link>
          </div>

          <p className="text-sm ml-auto">{createdAtDate}</p>
        </div>
      </section>
    </li>
  );
}

export default Item;