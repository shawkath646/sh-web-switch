"use client";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm, SubmitHandler } from "react-hook-form"
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { DefaultFormDataTypes } from '../lib/defaultData';
import StylistInput from '../components/MEXTUI/StylistInput';
import StylistFileInput from '../components/MEXTUI/StylistFileInput';
import StylistButton from '../components/MEXTUI/StylistButton';
import toBase64 from '../lib/toBase64';
import uploadData from '../lib/uploadData';
import { AiOutlineCloudUpload } from 'react-icons/ai';



export default function Page() {

  const [status, setStatus] = useState({
    type: true,
    status: ""
  })

  const router = useRouter();
  const searchParams = useSearchParams();

  const siteID = searchParams.get('siteID') ?? '';
  const imageUrl = searchParams.get('imageURL') || '';

  const schema = yup.object().shape({
    siteID: yup.string()
      .test('valid-site-id', 'Minimum 8 - maximum 32 character and no special character and empty space', value => {
        if (value === undefined || value === '') return true;
        else return /^[a-zA-Z0-9]{8,32}$/.test(value);
      }),
    siteName: yup.string().required('Site Name is required').min(3, 'Site Name must be at least 3 characters').max(32, 'Site Name cannot exceed 32 characters'),
    siteUrl: yup.string().url('Please enter a valid URL').required('Site URL is required'),
    siteMessage: yup.string().notRequired(),
    siteData: yup.string().notRequired().test('isValidJSON', 'Invalid JSON', function(value) {
      if (!value) return true;
      try {
        JSON.parse(value);
        return true;
      } catch (error) {
        return false;
      }
    }),
    isEnabled: yup.boolean().notRequired(),
    imageUrl: yup.string().notRequired(),
    base64Image: yup.string().notRequired(),
    selectedFile: yup.mixed().nullable().notRequired()
  });

  const { control, register, formState: { errors }, handleSubmit } = useForm<DefaultFormDataTypes>({
    defaultValues: {
      siteID,
      siteName: searchParams.get('siteName') || '',
      siteUrl: searchParams.get('siteURL') || '',
      siteMessage: searchParams.get('siteMessage') || '',
      siteData: searchParams.get('siteData') || '',
      isEnabled: searchParams.get('isEnabled') === 'true',
      imageUrl,
      base64Image: ''
    },
    resolver: yupResolver<any>(schema),
  });

  const [isLoading, setLoading] = useState(false);

  const handleLogo = (onChange: (file: File) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    if (file) onChange(file);
  };

  


  const onSubmit: SubmitHandler<DefaultFormDataTypes> = async(data) => {

    setLoading(true);

    if (data.selectedFile) {
      const base64File = await toBase64(data.selectedFile);
      if (typeof base64File === "string") {
        data.base64Image = base64File;
      }
    }

    let imageStatus = "same";

    if (data.imageUrl && data.selectedFile) imageStatus = "updated";
    else if (!data.imageUrl && data.selectedFile) imageStatus = "added";

    data.selectedFile = null;
    
    try {
      const { type, status } = await uploadData({ data, siteID, imageStatus });
      setStatus({ type, status });
      setLoading(false);
      if (type) setTimeout(() => router.push("/"), 1000);
    } catch (error: any) {
      setStatus({ type: false, status: error.toString() });
      setLoading(false);
    }
  };


  return (
    <main className="min-h-screen">
        <section className="container p-4 mx-auto">
            <Link href="/">
              <p className="text-4xl lg:text-5xl leading-none tracking-tight font-extrabold">
                  <span className="text-blue-600">SH</span> WEB SWITCH
              </p>
              <p>Control every application made by SH MARUF</p>
            </Link>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-10 lg:gap-y-0 mt-20">
                <div>
                    <StylistInput type="text" labelText="Site ID (Optional)" label="siteID" register={register} errorText={errors.siteID?.message} />
                    <StylistInput type="text" labelText="Site Name" label="siteName" register={register} errorText={errors.siteName?.message} />
                    <StylistInput type="text" labelText="Site URL" label="siteUrl" register={register} errorText={errors.siteUrl?.message}  />
                    <StylistInput type="text" labelText="Message (Only show if disabled!) :" label="siteMessage"  register={register} errorText={errors.siteMessage?.message} />
                    <div className="space-y-2 flex items-center justify-between">
                        <Controller
                            control={control}
                            name="selectedFile"
                            render={({ field: { value, onChange } }) => (
                            <StylistFileInput
                                accept="image/*"
                                onChange={handleLogo(onChange)}
                                labelText="Site Logo"
                                selectedName={value?.name || imageUrl}
                            />
                            )}
                        />
                        <Controller
                          control={control}
                          name="isEnabled"
                          render={({ field: { value, onChange } }) => (
                            <div className="flex space-x-1 items-center">
                              <p>Enabled :</p>
                              <label className="relative inline-flex items-center text-gray-900">
                                <input type="checkbox" id="isEnabled" checked={value} value="" onChange={onChange} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full  after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 cursor-pointer"></div>
                              </label>
                            </div>
                          )}
                          />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="siteData" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Site data :</label>
                    <textarea id="siteData" {...register("siteData")} className={`h-[150px] lg:h-[350px] resize-none appearance-none block w-full bg-gray-200 text-gray-700 border ${ errors.siteData?.message ? "border-red-500" : "border-blue-500" } rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white transition-all`}
                    placeholder={
                        `
                        {
                            "requireId": "abdc456",
                        }
                        `
                    } 
                    />
                    <p className="text-red-500 text-xs italic h-5">{errors.siteData?.message}</p>
                </div>
                <div className="flex justify-between items-center col-span-1 lg:col-span-2">
                    <p className={status.type ? "text-emerald-700" : "text-red-500"}>{status.status}</p>
                    <StylistButton type="submit" loading={isLoading} label="Upload" loadingLabel="Uploading" size="sm" bgColor="#d60927" space={3} bgColorOnHover="#a3051d" childrenBeforeLabel>
                    <AiOutlineCloudUpload size={16} />
                    </StylistButton>
                </div>
            </form>
        </section>
    </main>
  );
}

