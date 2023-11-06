"use client";
import { Fragment } from "react";
import { useSearchParams } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import AddNewDialogue from "./AddNewDialogue";
import DeleteDialogue from "./DeleteDialogue";

export default function DialogueBox() {

    const searchParams = useSearchParams();

    const isOpenParams = (e: string) => {
        const val = searchParams.get(e);
        if (val === "true") return true;
        else if (val === null)
        return false;
        else return false;
    };
    

    return (
        <>
            <Transition appear show={isOpenParams("addNewDialogue")} as={Fragment}>
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
                <AddNewDialogue />
                </Dialog>
            </Transition>


            <Transition appear show={isOpenParams("deleteDialogue")} as={Fragment}>
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
                <DeleteDialogue />
                </Dialog>
            </Transition>
        </>
    );
}