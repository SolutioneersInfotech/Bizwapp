"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

const ProfileAvatar = () => {
  const { data: session } = useSession()
  const [localUser, setLocalUser] = useState<{ firstName: string, lastName: string } | null>(null)

//   const sessionExpiration = new Date(session.expires).toLocaleString();
//   console.log("Session Expiration:", sessionExpiration);

  // Get local storage user (for Node.js login)
  useEffect(() => {
    const storedUser = localStorage.getItem("user") // or whatever key you use
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        setLocalUser({
          firstName: parsed.firstName,
          lastName: parsed.lastName,
        })
      } catch (err) {
        console.error("Invalid user in localStorage:", err)
      }
    }
  }, [])

  const getInitials = (name?: string, firstName?: string, lastName?: string) => {
    if (name) {
      const [first = "", last = ""] = name.split(" ")
      return `${first[0] || ""}${last[0] || ""}`.toUpperCase()
    } else if (firstName || lastName) {
      return `${(firstName?.[0] || "")}${(lastName?.[0] || "")}`.toUpperCase()
    }
    return ""
  }

  const initials = getInitials(session?.user?.name, localUser?.firstName, localUser?.lastName)

  return (
    <div className="flex items-center gap-2">
      {initials && (
        <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center ">
          {initials}
        </div>
      )}
      {/* <span className="text-sm font-medium">
        {session?.user?.name || `${localUser?.firstName || ""} ${localUser?.lastName || ""}`}
      </span> */}
    </div>
  )
}

export default ProfileAvatar
