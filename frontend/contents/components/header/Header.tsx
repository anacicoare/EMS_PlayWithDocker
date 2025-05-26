import { Avatar, Button, Card, Divider, Text, UnstyledButton } from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ProfileContext } from "@/contexts/ProfileContext";
import { usePathname } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const profile = useContext(ProfileContext);
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useContext(ProfileContext);

  useEffect(() => {
    const profileExists = localStorage.getItem("profile");

    if (profileExists && pathname === "/") {
      router.push("/teams").then(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen overflow-y-auto">
        <Text className="text-white text-lg">Loading...</Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className={`flex items-center justify-between h-[50px] w-full px-10 ${
        profile?.profile?.email ? "text-slate-600" : "text-white"
      }`}>
        {/* Left-aligned navigation */}
        {profile?.profile?.email ? (
          <div className="flex">
            <Button
              variant="subtle"
              className={`${profile?.profile?.email ? "text-slate-600" : "text-white"} font-medium`}
              onClick={() => router.push("/teams")}
            >
              Teams
            </Button>
            <Button
              variant="subtle"
              className={`${profile?.profile?.email ? "text-slate-600" : "text-white"} font-medium`}
              onClick={() => {return router.push("/payroll")}}
            >
              Payroll
            </Button>
            <Button
              variant="subtle"
              className={`${profile?.profile?.email ? "text-slate-600" : "text-white"} font-medium`}
              onClick={() => router.push("/tasks")}
            >
              Tasks
            </Button>
          </div>
        ) : (
          <div></div>
        )}

        {/* Right-aligned navigation */}
        <div className="flex items-center space-x-4">
          {profile?.profile?.email ? (
            <>
              <Button
                variant="subtle"
                className={`${profile?.profile?.email ? "text-slate-600" : "text-white"} font-medium`}
                onClick={() => router.push("/profile")}
              >
                My Profile
              </Button>
              <Button
                variant="subtle"
                className={`${profile?.profile?.email ? "text-slate-600" : "text-white"} font-medium`}
                onClick={logout}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                color="gray.1"
                radius="xl"
                size="sm"
                onClick={() => router.push("/login")}
              >
                Log in
              </Button>
              <Button
                variant="filled"
                color="gray.1"
                radius="xl"
                size="sm"
                className="text-black"
                onClick={() => router.push("/register")}
              >
                Register now
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Divider below the header */}
      <Divider 
        className="ml-4 mr-4" 
        style={{
          borderColor: localStorage.getItem("profile") ? 'rgba(197, 195, 195, 0.5)' : 'white', // Conditional color
          borderWidth: 2
        }} 
      />

    </div>
  );
}