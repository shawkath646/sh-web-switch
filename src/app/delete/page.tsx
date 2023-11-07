"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from 'next-auth/react';
import { useState } from "react";
import StylistButton from "../components/MEXTUI/StylistButton";
import deleteData from "../lib/deleteData";
import { MdDelete } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';





const DeleteDialogue = () => {

  const [status, setStatus] = useState({
      type: true,
      status: ""
  });
  const [isLoading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const siteID = searchParams.get("siteID");
  const imageUrl = searchParams.get("imageUrl") || '';

  const handleDelete = async() => {
    if (!siteID) {
      setStatus({ type: false, status: "Invalid site data provided"});
      return;
    }
    setLoading(true);
    try {
      const { type, status } = await deleteData(siteID, imageUrl);
      setStatus({ type, status });
      setLoading(false);
      setTimeout(() => router.back(), 1000);
    } catch (error: any) {
      setStatus({ type: false, status: error.toString()});
      setLoading(false);
    }
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="border p-8 rounded-md shadow">
          <div className="flex justify-between items-center mb-5 text-center">
            <p className="text-2xl font-semibold text-center w-[92%]">Delete confirmation</p>
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
      </div>
    </div>
  );
}

export default DeleteDialogue;