"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, User } from "lucide-react"
import { useEffect, useState } from "react"
import ProfileAvatar from "./profileAvatar"

export function UserNav() {
  const [user, setUser]= useState({
    firstName:"",
    lastName:"",
    email:""
  });

    const router = useRouter();



 const handleLogout = async () => {

  try {
    const response = await fetch("https://api.bizwapp.com/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      router.push("/login");
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
};


  useEffect(()=>{
    const user = localStorage.getItem("user");
    if(user){
      const parsedUser = JSON.parse(user)
      setUser(parsedUser);
    }
  },[])
  
  const initials = `${user?.firstName?.[0] || " "}${user?.lastName?.[0] || "" }`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          {/* <div className="relative h-8 w-8 rounded-full bg-primary/10"> */}
            {/* <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-primary">
              {initials}
            </span> */}
            <ProfileAvatar/>
          {/* </div> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{`${user.firstName}  ${user.lastName}`}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

