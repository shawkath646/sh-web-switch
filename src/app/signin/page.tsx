"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { SignInFormDataTypes } from '../lib/defaultData';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import backgroundImage from '../assets/background.jpg';





const LoginPage = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const schema = yup.object().shape({
    username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters').max(32, 'Site Name cannot exceed 16 characters'),
    password: yup.string().required('Password is required').min(3, 'Password must be at least 8 characters').max(32, 'Password cannot exceed 32 characters'),
  })

  const { register, formState: { errors }, handleSubmit } = useForm<SignInFormDataTypes>({
    resolver: yupResolver<any>(schema),
  });

  const onSubmit = async (data: SignInFormDataTypes) => {  
    setLoading(true);
    await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false
    })
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
        <Image src={backgroundImage.src} alt="Green leaf background" fill priority className="object-cover" />
      </div>
      <main className="bg-center bg-cover min-h-screen text-white">
        <div className="mx-auto p-4 container">
          <p className="text-4xl lg:text-5xl leading-none tracking-tight font-extrabold">
            <span className="text-blue-600">SH</span> WEB SWITCH
          </p>
          <p>Control every application made by SH MARUF</p>
          <p className="my-8 text-blue-500 font-semibold max-w-xl">Unlock the door as a visitor with the keys 'Username' and 'Password,' both set to 'guest'.</p>
          <div className="h-[500px] flex flex-col items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="w-[400px] lg:w-[500px]">
              <h1 className="text-3xl lg:text-4xl font-semibold mb-4 text-center">Login</h1>
              <input
                type="text"
                placeholder="Username"
                {...register('username')}
                className="w-full border-b-[1.5px] p-2 mb-4 bg-transparent outline-none focus:border-blue-500 transition-all"
              />
              <p className="text-red-500 text-xs italic h-5">{errors.username?.message}</p>
              <input
                type="password"
                placeholder="Password"
                {...register('password')}
                className="w-full border-b-[1.5px] p-2 mb-4 bg-transparent outline-none focus:border-blue-500 transition-all"
              />
              <p className="text-red-500 text-xs italic h-5">{errors.password?.message}</p>
              <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-500 transition-all block mt-10">Login</button>
            </form>
            <p className="h-[25px] text-red-500 mt-5">{status}</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
