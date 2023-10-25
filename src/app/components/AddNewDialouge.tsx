import { FormEvent, Fragment, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { addDoc, serverTimestamp, collection, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Dialog, Switch, Transition } from '@headlessui/react';
import { AddNewDialougePropsTypes, defaultBlankData } from '../lib/defaultData';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { RxCross2 } from 'react-icons/rx';
import { db, storage } from '@/app/lib/firebase';
import StylistInput from './MEXTUI/StylistInput';
import StylistFileInput from './MEXTUI/StylistFileInput';
import StylistButton from './MEXTUI/StylistButton';


const AddNewDialouge = ({ addNewDialouge, setAddNewDialouge, getSiteList }: AddNewDialougePropsTypes) => {

  const initialFormErrors = {
    siteName: "",
    siteUrl: "",
    siteData: "",
    status: { type: true, value: '' }
  }

  const [formData, setFormData] = useState<any>(defaultBlankData);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [siteLogo, setSiteLogo] = useState<File | null>(null);
  const [isLoading, setLoading] = useState(false);

  const initialRender = useRef(true);

  const { data: session } = useSession();

  useEffect(() => {
    if (!initialRender.current) {
      setFormData({
        siteID: addNewDialouge.siteRawData.siteID,
        siteName: addNewDialouge.siteRawData.siteName,
        siteUrl: addNewDialouge.siteRawData.siteUrl,
        siteMessage: addNewDialouge.siteRawData.siteMessage,
        siteData: addNewDialouge.siteRawData.siteData,
        isEnabled: addNewDialouge.siteRawData.isEnabled,
        createdAt: serverTimestamp(),
        imageUrl: addNewDialouge.siteRawData.imageUrl
      })
    } else {
      initialRender.current = false;
    }
  }, [addNewDialouge.isOpen])

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSiteLogo(e.target.files[0]);
    }
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { siteData, siteName, siteUrl } = formData;

    setFormErrors(initialFormErrors);

    let hasErrors = false;
    if (siteName.length < 3) {
      setFormErrors({ ...formErrors, siteName: "Invalid site name! Minimum 3 character required."});
      hasErrors = true;
    }
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    const validUrl = urlPattern.test(siteUrl);
    if (!validUrl) {
      setFormErrors({ ...formErrors, siteUrl: "Invalid URL!"});
      hasErrors = true;
    }

    if (hasErrors) return;

    if (session?.user?.name === "Guest") return;

    setLoading(true);

    try {
      if (addNewDialouge.siteRawData.siteID) {
        await updateDoc(doc(db, 'siteinfo', addNewDialouge.siteRawData.siteID), formData, { merge: true });
      } else {
        let imageUrl = '';
        const docRef = await addDoc(collection(db, 'siteinfo'), formData);

        if (siteLogo) {
          const storageRef = ref(storage, `images/${docRef.id}`);
          await uploadBytes(storageRef, siteLogo);
          imageUrl = await getDownloadURL(storageRef);
        }

        const updateThis: any = {
          siteID: docRef.id,
          imageUrl,
        }

        await updateDoc(doc(db, 'siteinfo', docRef.id), updateThis, { merge: true });
        setFormErrors({...formErrors, status: { type: true, value: "Submitted successfully !"} });
      }
    } catch (error: any) {
      setFormErrors({...formErrors, status: { type: false, value: error.toString() } });
      setLoading(false);
      return;
    }

    setLoading(false);
    setTimeout(() => {
      getSiteList();
      setAddNewDialouge({
        isOpen: false,
        siteRawData: defaultBlankData
      });
      setFormErrors(initialFormErrors);
      setSiteLogo(null);
      setFormData(defaultBlankData);
    }, 1000);
  };


  return (
    <Transition appear show={addNewDialouge.isOpen} as={Fragment}>
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
            <Dialog.Panel className="mx-auto overflow-y-scroll overflow-x-hidden scrollbar-hide lg:w-[1000px] container rounded bg-white p-6">
              <div className="flex justify-between items-center mb-5 text-center">
                <Dialog.Title className="mb-4 text-2xl leading-none tracking-tight text-gray-900 lg:text-3xl w-[92%]">{addNewDialouge.siteRawData.siteID ? "Update Site info" : "Add new site"}</Dialog.Title>
                <button type="button" onClick={() => setAddNewDialouge({ isOpen: false, siteRawData: defaultBlankData })} className="w-[8%] outline-none">
                  <RxCross2 size={32} className="text-gray-500 hover:text-black transition-all" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-10 lg:gap-y-0">
                <div>
                  <StylistInput type="text" label="Site Name" value={formData.siteName} onChange={e => setFormData({ ...formData, siteName: e.target.value })} errorText={formErrors.siteName} placeholder="Google"  />

                  <StylistInput type="text" label="Site URL" value={formData.siteUrl} onChange={e => setFormData({ ...formData, siteUrl: e.target.value })} errorText={formErrors.siteUrl} placeholder="https://google.com"  />

                  <StylistInput type="text" label="Message (Only show if disabled!) :"  value={formData.siteMessage} onChange={e => setFormData({ ...formData, siteMessage: e.target.value })} placeholder="This site is disabled!"  />

                  <div className="space-y-2 flex items-center justify-between">

                    <StylistFileInput accept="image/*" onChange={handleLogo} label="Site Logo" selectedName={siteLogo?.name || formData.imageUrl} />

                    <div className="flex items-center space-x-5">
                      <label htmlFor="isEnabled" className="block uppercase tracking-wide text-gray-700 text-xs font-bold">Enabled :</label>
                      <Switch
                        checked={formData.isEnabled}
                        id="isEnabled"
                        onChange={() => setFormData({ ...formData, isEnabled: !formData.isEnabled })}
                        className={`${formData.isEnabled ? 'bg-blue-700' : 'bg-gray-500'}
                          relative inline-flex h-[28px] w-[54px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                      >
                        <span className="sr-only">Use setting</span>
                        <span
                          aria-hidden="true"
                          className={`${formData.isEnabled ? 'translate-x-6' : 'translate-x-0'}
                            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                    </div>
                  </div>
                  
                </div>
                <div className="space-y-2">
                  <label htmlFor="siteData" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Site data :</label>
                  <textarea id="siteData" value={formData.siteData} onChange={e => setFormData({ ...formData, siteData: e.target.value })} className="h-[150px] lg:h-[350px] resize-none appearance-none block w-full bg-gray-200 text-gray-700 border border-blue-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    placeholder={
                      `
                        {
                          "requireId": "abdc456",
                        }
                      `
                    } 
                  />
                  <p className="text-red-500 text-xs italic h-5">{formErrors.siteData}</p>
                </div>
                <div className="flex justify-between items-center col-span-1 lg:col-span-2">
                  <p className={formErrors.status.type ? "text-emerald-700" : "text-red-500"}>{formErrors.status.value}</p>
                  <StylistButton type="submit" loading={isLoading} label="Upload" loadingLabel="Uploading" size="sm" bgColor="#d60927" space={3} bgColorOnHover="#a3051d" childrenBeforeLabel>
                    <AiOutlineCloudUpload size={16} />
                  </StylistButton>
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
