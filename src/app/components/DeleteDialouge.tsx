import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from "../firebase";
import { CgSpinner } from 'react-icons/cg';
import { MdDelete } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';

interface DeleteDialougeProps {
  deleteDialouge: {
    isOpen: boolean;
    siteID: string;
  }
  setDeleteDialouge: (e: any) => void;
  getSiteList: () => void;
}

interface status {
  type: boolean,
  value: string
}

const DeleteDialouge = ({ deleteDialouge, setDeleteDialouge, getSiteList }: DeleteDialougeProps) => {

  const [status, setStatus] = useState<status>({
      type: true,
      value: ""
  });
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleDelete = async() => {
    setLoading(true);
    try {
      const docRef = doc(db, 'siteinfo', deleteDialouge.siteID);
      await deleteDoc(docRef);
      const storageRef = ref(storage, `images/${deleteDialouge.siteID}`);
      await deleteObject(storageRef);
      setStatus({ type: true, value: "Deleted successfully !"});
    } catch (error: any) {
      setStatus({ type: false, value: error.toString()});
      return;
    }
    setLoading(false);
    setTimeout(() => {
      getSiteList();
      setDeleteDialouge({ isOpen: false, siteID: "" });
    }, 1000);

  }
  
  return (
    <Transition appear show={deleteDialouge.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

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
                <button type="button" onClick={() => setDeleteDialouge({ isOpen: false, siteID: ""})} className="w-[8%]">
                  <RxCross2 size="lg" className="h-9 w-9 text-gray-500 hover:text-black transition-all" />
                </button>
              </div>

              <p>Are you sure to Delete this site from switch panel? This can't be undone!</p>
              <p>All data related to this site will be deleted.</p>


              <div className="flex justify-between items-center col-span-1 lg:col-span-2 mt-5">
                <p className={status.type ? "text-emerald-700" : "text-red-500"}>{status.value}</p>
                <button type="button" disabled={isLoading} onClick={handleDelete} className="px-2 py-1 text-white rounded flex items-center space-x-1 bg-red-500 disabled:bg-gray-500 hover:bg-red-700 transition-all">
                  {isLoading ? <CgSpinner size="lg" className="h-4 w-4 animate-spin" /> : <MdDelete size="lg" className="h-4 w-4" />}
                  <p>{isLoading ? "Deleting..." : "Delete"}</p>
                </button>
              </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default DeleteDialouge;