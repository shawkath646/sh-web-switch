"use client";
import { Fragment, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from 'next-auth/react';
import { Dialog, Transition } from "@headlessui/react";
import StylistButton from "./MEXTUI/StylistButton";
import { MdDelete } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';
import deleteData from "../lib/deleteData";




const DeleteDialogue = () => {

  const [status, setStatus] = useState({
      type: true,
      status: ""
  });
  const [isLoading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const siteID = searchParams.get("siteID");
  const imageUrl = searchParams.get("imageUrl");

  const handleDelete = async() => {
    if (!siteID || imageUrl === null) {
      setStatus({ type: false, status: "Invalid site data provided"});
      return;
    }
    if (session?.user?.name === "Guest") return;
    setLoading(true);
    try {
      const { type, status } = await deleteData(siteID, imageUrl);
      setStatus({ type, status });
      setLoading(false);
      setTimeout(() => router.push("?deleteDialogue=false"), 1000);
    } catch (error: any) {
      setStatus({ type: false, status: error.toString()});
      setLoading(false);
    }
  }
  
  return (
    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="mx-auto max-w-2xl container rounded bg-white p-6">
          <div className="flex justify-between items-center mb-5 text-center">
            <Dialog.Title className="text-2xl font-semibold text-center w-[92%]">Delete confirmation</Dialog.Title>
            <button type="button" onClick={() => router.push("?deleteDialogue=false")} className="w-[8%] outline-none">
              <RxCross2 size={32} className="text-gray-500 hover:text-black transition-all" />
            </button>
          </div>
          <p>Are you sure to Delete this site from switch panel? This can't be undone!<br /> All data related to this site will be deleted.</p>
          <div className="flex justify-between items-center col-span-1 lg:col-span-2 mt-5">
            <p className={status.type ? "text-emerald-700" : "text-red-500"}>{status.status}</p>
            <StylistButton onClick={handleDelete} disabled={isLoading} loading={isLoading} label="Confirm Delete" loadingLabel="Deleting..." size="sm" bgColor="#d60927" space={3} bgColorOnHover="#a3051d" childrenBeforeLabel>
              <MdDelete size={16} />
            </StylistButton>
          </div>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </div>
  );
}

export default DeleteDialogue;