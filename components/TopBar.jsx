"use client";

import { Logout } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";




// import SunIcon from "./icons/SunIcon";
// import MoonIcon from "./icons/MoonIcon";
// import { useTheme } from "next-themes";

const TopBar = () => {
  const pathname = usePathname();

  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  };

  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="topbar ">
      <Link href="/chats">
    
      <h2 className="logo" style={{ fontSize: "30px" }}>
  <span style={{ color: "rgb(107 33 168)", fontWeight: "bold" }}>C</span>
  <span style={{ color: "white", fontWeight: "bold" }}>onvonest</span>
  
</h2>

        {/* <img src="/assets/Convo-nest.png" alt="logo" className="logo" /> */}
      </Link>

      <div className="menu">
      
        <Link
          href="/chats"
          className={`${
            pathname === "/chats" ? "text-purple-600" : ""
          } text-heading4-bold`}
        >
          Chats
        </Link>
        <Link
  href="/contacts"
  className={`${
    pathname === "/contacts" ? "text-purple-600" : ""
  } text-heading4-bold`}
>


          Contacts
        </Link>

        <Logout
          sx={{ color: "#737373", cursor: "pointer" }}
          onClick={handleLogout}
        />

        <Link href="/profile">
          <img
            src={user?.profileImage || "/assets/person.jpg"}
            alt="profile"
            className="profilePhoto"
          />
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
