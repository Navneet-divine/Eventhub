"use client";

import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import HeroSection from "@/components/HeroSection";

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="p-4 text-gray-500">Loading...</p>
      </div>
    );
  }

  const imageSrc = session?.user?.image;
  return (
    <div>
      <HeroSection />
      <button
        onClick={() => {
          toast.success("Logging out...");
          signOut({ redirect: true, callbackUrl: "/" });
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
