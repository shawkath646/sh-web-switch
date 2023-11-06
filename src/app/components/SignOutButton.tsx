"use client";
import { signOut } from 'next-auth/react'
import StylistButton from './MEXTUI/StylistButton';
import { BiLogOut } from "react-icons/bi";

export default function SignOutButton() {


    return (
        <StylistButton onClick={() => signOut()} label="Log Out" size="sm" bgColor="#7d0acf" space={3} bgColorOnHover="#5b0896">
            <BiLogOut size={16} />
        </StylistButton>
    )
}