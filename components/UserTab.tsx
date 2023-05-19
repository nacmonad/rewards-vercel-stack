import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";


type UserDropdownProps = {
    session: Session;
  };

const UserTab : React.FC<UserDropdownProps> = ( { session } ) => {
  const router = useRouter()  
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
        };

    const handleDocumentClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest(".user-dropdown")) {
            setShowDropdown(false);
        }
        };
        
    useEffect(() => {
        document.addEventListener("click", handleDocumentClick);
        return () => {
        document.removeEventListener("click", handleDocumentClick);
        };
        }, []);
        
    return (<div className="right relative w-32 user-dropdown">
    <div
      className="flex items-center space-x-2 cursor-pointer"
      onClick={toggleDropdown}
    >
      <img
        src={session.user.image}
        alt="User Avatar"
        className="w-8 h-8 rounded-full"
      />
      <span>{session.user.name}</span>
    </div>
    {showDropdown && (
      <div className="absolute top-10 right-0 bg-white rounded shadow py-2">
        <button onClick={()=>router.push('/dashboard')} className="block px-4 py-2">
          Dashboard
        </button>
        <button onClick={()=>signOut()} className="block px-4 py-2">
          Sign Out
        </button>
      </div>
    )}
  </div>)
}

export default UserTab;