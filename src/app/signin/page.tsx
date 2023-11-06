"use client"
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import backgroundImage from '../assets/background.jpg';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    if (!username || !password) return;

    setLoading(true);
  
    await signIn('credentials', { username, password, redirect: false })
      .then((response: any) => {
        if (response.ok) router.push('/');
        else {
          setStatus(response.error);
          setLoading(false);
        }
      });
  };

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
            <p className="my-8 text-blue-500 font-semibold max-w-xl">Unlock the door as a visitor with the keys 'Username' and 'Password,' both set to 'guest'.</p>
            <div className="h-[500px] flex flex-col items-center justify-center">
              
              <form onSubmit={handleSubmit}>
                <h1 className="text-3xl lg:text-4xl font-semibold mb-4 text-center">Login</h1>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full border-b-[1.5px] p-2 mb-4 bg-transparent outline-none focus:border-blue-500 transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border-b-[1.5px] p-2 mb-4 bg-transparent outline-none focus:border-blue-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-500 transition-all block mt-10">Login</button>
              </form>
              <p className="h-[25px] text-red-500 mt-5">{status}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
