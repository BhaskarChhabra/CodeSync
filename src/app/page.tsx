"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
export default function Home() {
  return (
   <div className= "m-10">

     <SignInButton>
      <Button>
        Sign In
      </Button>
     </SignInButton>

   </div>
   
  );
}
