"use client";
import Image from 'next/image';
import { SessionProvider } from 'next-auth/react'
import backgroundImage from '../assets/background.jpg';

const MainLayout = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
    return (
        <SessionProvider>
          <div className="absolute top-0 left-0 -z-10 h-full w-full">
            <Image src={backgroundImage.src} alt="Green leaf background" fill className="object-cover" />
          </div>
          <main className="bg-center bg-cover min-h-screen text-white">
            <div className="min-h-screen backdrop-blur-xl">
              <div className="mx-auto p-4 container">
                <p className="text-4xl lg:text-5xl leading-none tracking-tight font-extrabold">
                  <span className="text-blue-600">SH</span> WEB SWITCH
                </p>
                <p>Control every application made by SH MARUF</p>
                {children}
              </div>
            </div>
          </main>
        </SessionProvider>
    );
}

export default MainLayout;