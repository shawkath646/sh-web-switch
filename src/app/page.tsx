import 'server-only'
import Link from "next/link";
import Image from 'next/image';
import { redirect } from 'next/navigation'
import { getServerSession } from "next-auth/next"
import SiteList from './components/SiteList';
import StylistButton from "./components/MEXTUI/StylistButton";
import SignOutButton from "./components/SignOutButton";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import backgroundImage from './assets/background.jpg';
import { AiFillPlusCircle } from "react-icons/ai";




export default async function Page() {

  const session = await getServerSession(authOptions);

  if (!session) redirect("/signin");

  return (
    <>
      <div className="fixed top-0 left-0 -z-10 h-screen w-full">
        <Image src={backgroundImage.src} alt="Green leaf background" fill priority className="object-cover" />
      </div>
      <main className="bg-center bg-cover min-h-screen text-white">
        <div className="mx-auto p-4 container">
          <p className="text-4xl lg:text-5xl leading-none tracking-tight font-extrabold">
            <span className="text-blue-600">SH</span> WEB SWITCH
          </p>
          <p>Control every application made by SH MARUF</p>

          <section className="mt-20">
    
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
              <p className="text-sm truncate">Login ID: {session?.user?.name}</p>
              <div className="flex items-center space-x-2 ml-auto">

              <SignOutButton />

                <Link href="/new">
                  <StylistButton label="Add new" size="sm" bgColor="#0f76d6" space={3} bgColorOnHover="#0b5aa3" childrenBeforeLabel>
                    <AiFillPlusCircle size={16} />
                  </StylistButton>
                </Link>

              </div>
            </div>
            
            <SiteList />  
          </section>
        </div>
      </main>
    </>
  );
}

