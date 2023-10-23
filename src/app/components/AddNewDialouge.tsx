import { FormEvent, Fragment, useState } from 'react';
import { useSession } from 'next-auth/react';
import { addDoc, serverTimestamp, collection, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Dialog, Switch, Transition } from '@headlessui/react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { CgSpinner } from 'react-icons/cg';
import { RxCross2 } from 'react-icons/rx';
import { db, storage } from '@/app/firebase';

interface AddNewDialougeProps {
  isOpen: boolean;
  setAddNewDialouge: (isOpen: boolean) => void;
  getSiteList: () => void;
}

interface formText {
  value: string,
  error: string
}

interface status {
  type: boolean,
  value: string
}

interface updateDataProps {
  siteID: "";
  imageURL: string
}

const AddNewDialouge: React.FC<AddNewDialougeProps> = ({ isOpen, setAddNewDialouge, getSiteList }) => {

  const [siteName, setSiteName] = useState<formText>({
    value: "",
    error: ""
  });
  const [siteUrl, setSiteUrl] = useState<formText>({
    value: "",
    error: ""
  });
  const [siteLogo, setSiteLogo] = useState<File | null>(null);
  const [siteData, setSiteData] = useState<string>("");
  const [isEnabled, setEnabled] = useState<boolean>(true);
  const [siteMessage, setSiteMessage] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<status>({
    type: true,
    value: ""
  });

  const { data: session } = useSession();

  const handleLogo = (e: any) => {
    if (!e.target.files) return;
    setSiteLogo(e.target.files[0])
  }

  const handleSubmit = async(e: FormEvent) => {
    e.preventDefault();
    if (!siteName.value) {
      setSiteName({...siteName, error: "Site name is not valid!"});
      return;
    } else {
      setSiteName({...siteName, error: ""});
    }
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    const validUrl = urlPattern.test(siteUrl.value);
    if (!validUrl) {
      setSiteUrl({...siteUrl, error: "URL is not valid!"});
      return;
    } else {
      setSiteUrl({...siteUrl, error: ""});
    }
    if (session?.user?.name === "Guest") return;
    setLoading(true);
    try {
      let imageUrl = "";
      const docRef = await addDoc(collection(db, 'siteinfo'), {
        siteName: siteName.value,
        siteUrl: siteUrl.value,
        isEnabled,
        siteMessage,
        createdAt: serverTimestamp(),
        siteData,
      });
      if (siteLogo) {
        const storageRef = ref(storage, `images/${docRef.id}`);
        await uploadBytes(storageRef, siteLogo);
        imageUrl = await getDownloadURL(storageRef);
      }
      await updateDoc(doc(db, 'siteinfo', docRef.id), {
        siteID: docRef.id,
        imageUrl,
      }: updateDataProps, { merge: true });
      setStatus({ type: true, value: "Submitted successfully !"});
    } catch (error: any) {
      setStatus({ type: false, value: error.toString()});
      return;
    }
    setLoading(false);
    setTimeout(() => {
      getSiteList();
      setAddNewDialouge(false);
    }, 1000);
  }

  

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={() => {}} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        </Transition.Child>


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
            <Dialog.Panel className="mx-auto w-[550px] lg:w-[1000px] container rounded bg-white p-6">
              <div className="flex justify-between items-center mb-5 text-center">
                <Dialog.Title className="text-2xl font-semibold text-center w-[92%]">Add new site</Dialog.Title>
                <button type="button" onClick={() => setAddNewDialouge(false)} className="w-[8%]">
                  <RxCross2 size="lg" className="h-9 w-9 text-gray-500 hover:text-black transition-all" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <div className="space-y-2">
                    <label htmlFor="siteName" className="block">Site name :</label>
                    <input id="siteName" type="text" value={siteName.value} onChange={e => setSiteName({...siteName, value: e.target.value})} className="outline-none w-full border-b-[1.7px] border-gray-500 focus:border-blue-500 transition-all" />
                    <p className="text-sm text-red-500 h-5">{siteName.error}</p>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="siteUrl" className="block">Site URL :</label>
                    <input type="text" id="siteUrl" value={siteUrl.value} onChange={e => setSiteUrl({...siteUrl, value: e.target.value})} className="outline-none w-full border-b-[1.7px] border-gray-500 focus:border-blue-500 transition-all" />
                    <p className="text-sm text-red-500 h-5">{siteUrl.error}</p>
                  </div>
                  <div className="space-y-2 mb-5">
                    <label htmlFor="siteMessage" className="block">Message (Only show if disabled!) :</label>
                    <input type="text" id="siteMessage" value={siteMessage} onChange={e => setSiteMessage(e.target.value)} className="outline-none w-full border-b-[1.7px] border-gray-500 focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-2 flex items-center justify-between">
                    <div className="space-y-2">
                      <label htmlFor="siteLogo" className="block">Site logo :</label>
                      <input id="siteLogo" type="file" accept="image/*" onChange={handleLogo} className="outline-none transition-all w-[105px]" />
                    </div>
                    <div className="flex items-center space-x-5">
                      <label htmlFor="isEnabled">Enabled :</label>
                      <Switch
                        checked={isEnabled}
                        id="isEnabled"
                        onChange={setEnabled}
                        className={`${isEnabled ? 'bg-blue-700' : 'bg-gray-500'}
                          relative inline-flex h-[28px] w-[54px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                      >
                        <span className="sr-only">Use setting</span>
                        <span
                          aria-hidden="true"
                          className={`${isEnabled ? 'translate-x-6' : 'translate-x-0'}
                            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                    </div>
                  </div>
                  
                </div>
                <div className="space-y-2">
                  <label htmlFor="siteData" className="block">Site data :</label>
                  <textarea id="siteData" value={siteData} onChange={e => setSiteData(e.target.value)} className="h-[350px] outline-none border-[1.5px] border-gray-500 focus:border-blue-500 transition-all w-full block p-2.5 rounded-sm resize-none" placeholder={`
                  {
                      "requireId": "abdc456",
                  }`} />
                </div>
                <div className="flex justify-between items-center col-span-1 lg:col-span-2">
                  <p className={status.type ? "text-emerald-700" : "text-red-500"}>{status.value}</p>
                  <button type="submit" disabled={isLoading} className="px-2 py-1 text-white rounded flex items-center space-x-1 bg-blue-700 disabled:bg-gray-500 hover:bg-blue-900 transition-all">
                    {isLoading ? <CgSpinner size="lg" className="h-4 w-4 animate-spin" /> : <AiOutlineCloudUpload size="lg" className="h-4 w-4" />}
                    <p>{isLoading ? "Uploading..." : "Upload"}</p>
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default AddNewDialouge;
