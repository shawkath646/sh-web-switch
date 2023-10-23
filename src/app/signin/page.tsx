"use client"
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    if (!username || !password) return;
  
    signIn('credentials', { username, password, redirect: false })
      .then((response: any) => {
        if (response.ok) {
          router.push('/');
        } else {
          console.log(response.error);
        }
      });
  };

  return (
    <>
      <p className="my-8 text-blue-500 font-semibold max-w-xl">Unlock the door as a visitor with the keys 'Username' and 'Password,' both set to 'guest'.</p>
      <div className="h-[500px] flex items-center justify-center">
        
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>
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
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 transition-all block mt-10">Login</button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
