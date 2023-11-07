import 'server-only'
import Link from "next/link";
import { redirect } from 'next/navigation'
import { getServerSession } from "next-auth/next"
import StylistButton from "./components/MEXTUI/StylistButton";
import { AiFillPlusCircle } from "react-icons/ai";
import SignOutButton from "./components/SignOutButton";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Image from 'next/image';
import backgroundImage from './assets/background.jpg';
import dynamic from 'next/dynamic'



export default async function Page() {

  const session = await getServerSession(authOptions);

  if (!session) redirect("/signin");

  const DynamicDialogueBox = dynamic(() => import('./components/DialogueBox'), {
    loading: () => <p>Loading...</p>,
  })

  const DynamicSiteList = dynamic(() => import('./components/SiteList'), {
    loading: () => <p>Loading...</p>,
  })

  return (
    <>
      <div className="fixed top-0 left-0 -z-10 h-screen w-full">
        <Image src={backgroundImage.src} alt="Green leaf background" fill className="object-cover" />
      </div>
      <main className="bg-center bg-cover min-h-screen text-white">
        <div className="min-h-screen backdrop-blur-xl">
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
              <p className="text-2xl text-blue-300 mt-10 lg:mt-0">Site List</p>
                
              <DynamicDialogueBox/>
              <DynamicSiteList />
              
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

