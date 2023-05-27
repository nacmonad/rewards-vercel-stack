import React, {useState} from "react";
import Link from "next/link";
import UserTab from "./UserTab";
import { useRouter } from "next/router";
import { signIn, signOut,useSession } from "next-auth/react";

const Header: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  

  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;
    
  let left = (
    <div className="left bold">
      <Link className="bold" data-active={isActive("/")} href="/">
          Home
      </Link>
    </div>
  );

  let right = session ? (
    <UserTab session={session} />
  ) : (<div className="right">
      <button onClick={() => signIn()}>Sign In</button>
    </div>)
  
  return (
    <nav className={`flex flex-row w-full justify-between`}>
      {left}
      {right}      
    </nav>
  );
};

export default Header;
