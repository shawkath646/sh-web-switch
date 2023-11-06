"use client";
import { Fragment, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Dialog, Switch, Transition } from '@headlessui/react';
import { Controller, useForm, SubmitHandler } from "react-hook-form"
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { DefaultFormDataTypes } from '../lib/defaultData';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { RxCross2 } from 'react-icons/rx';
import StylistInput from './MEXTUI/StylistInput';
import StylistFileInput from './MEXTUI/StylistFileInput';
import StylistButton from './MEXTUI/StylistButton';
import uploadData from '../lib/uploadData';


const AddNewDialogue = () => {

  const [status, setStatus] = useState({
    type: true,
    status: ""
  })

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const siteID = searchParams.get('siteID') ?? '';
  const imageUrl = searchParams.get('imageURL') || '';

  const schema = yup.object().shape({
    siteID: yup.string().required().min(8, 'Site ID must be at least 8 characters').max(32, 'Site ID cannot exceed 32 characters'),
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

  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
  
      fileReader.readAsDataURL(file);
  
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          resolve(fileReader.result?.split(',')[1]);
        }
      };
  
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };


  const onSubmit: SubmitHandler<DefaultFormDataTypes> = async(data) => {

    if (session?.user?.name === "Guest") return;

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
      setTimeout(() => router.push("?addNewDialogue=false"), 1000);
    } catch (error: any) {
      setStatus({ type: false, status: error.toString() });
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Dialog.Panel className="mx-auto overflow-y-scroll overflow-x-hidden scrollbar-hide lg:w-[1000px] container rounded bg-white py-3 px-6">
            <button type="button" onClick={() => router.push("?addNewDialogue=false")} className="ml-auto block outline-none">
              <RxCross2 size={32} className="text-gray-500 hover:text-black transition-all" />
            </button>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-10 lg:gap-y-0">
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

                <div className="flex items-center space-x-5">
                  <label htmlFor="isEnabled" className="block uppercase tracking-wide text-gray-700 text-xs font-bold">Enabled :</label>
                  <Controller
                    control={control}
                    name="isEnabled"
                    render={({ field: { value, onChange } }) => (
                      <Switch
                        checked={value}
                        id="isEnabled"
                        onChange={onChange}
                        className={`${value ? 'bg-blue-700' : 'bg-gray-500'}
                          relative inline-flex h-[28px] w-[54px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                      >
                        <span className="sr-only">Use setting</span>
                        <span
                          aria-hidden="true"
                          className={`${value ? 'translate-x-6' : 'translate-x-0'}
                            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                    )}
                  />
                </div>
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
        </Dialog.Panel>
      </Transition.Child>
    </div>
  );
}

export default AddNewDialogue;
