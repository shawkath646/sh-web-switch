import Link from "next/link";
import { getServerSession } from "next-auth/next"
import { collection, getDocs } from "firebase/firestore";
import { DefaultDataTypes } from "./lib/defaultData";
import Item from './components/Item';
import { db } from "./lib/firebase";
import StylistButton from "./components/MEXTUI/StylistButton";
import { AiFillPlusCircle } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import DialogueBox from "./components/DialogueBox";

const getSiteList = async () => {
  const siteListSnapshot = await getDocs(collection(db, 'siteinfo'));
  return siteListSnapshot.docs.map((doc) => doc.data() as DefaultDataTypes);
}


export default async function Page() {

  const session = await getServerSession(authOptions);

  const siteList = await getSiteList();

  return ( 
    <section className="mt-20">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
        <p className="text-sm truncate">Login ID: {session?.user?.name}</p>
        <div className="flex items-center space-x-2 ml-auto">

         <Link href="/signout">
            <StylistButton label="Log Out" size="sm" bgColor="#7d0acf" space={3} bgColorOnHover="#5b0896">
              <BiLogOut size={16} />
            </StylistButton>
          </Link>

          <Link href="/?addNewDialogue=true">
            <StylistButton label="Add new" size="sm" bgColor="#0f76d6" space={3} bgColorOnHover="#0b5aa3" childrenBeforeLabel>
              <AiFillPlusCircle size={16} />
            </StylistButton>
          </Link>

        </div>
      </div>

      <p className="text-2xl text-blue-300 mt-10 lg:mt-0">Site List</p>
        
      <DialogueBox />
      

      {siteList.length < 1 ? (
        <div className="w-full h-48 flex items-center justify-center">
          <p>No site added to list.</p>
        </div>
      ) : (
        <ul className="w-full mt-10 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {siteList.map((e, k) => {
            const createdAtDate = e.createdAt instanceof Date ? e.createdAt : new Date(e.createdAt.seconds * 1000);
            return <Item key={k} e={{ ...e, createdAt: createdAtDate }} />;
          })}
        </ul>
      )}
    </section>
  );
}

