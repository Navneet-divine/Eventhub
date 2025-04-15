"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const Dashboard: React.FC = () => {
  const { data: session } = useSession();

  const imageSrc = session?.user?.image;
  return (
    <div>
      <h1>{session?.user?.name}</h1>
      <div className="w-10 h-10 overflow-hidden rounded-full">
        {imageSrc ? (
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <Image
              src={imageSrc}
              alt={`${session.user.name}'s profile picture`}
              className="w-full h-full object-cover"
              width={100}
              height={100}
            />
          </div>
        ) : (
          <div className="w-10 h-10 flex items-center justify-center bg-gray-300 text-white font-bold rounded-full">
            {session?.user?.name}
          </div>
        )}
      </div>
      <button
        onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
        className="cursor-pointer"
      >
        logout
      </button>
    </div>
  );
};

export default Dashboard;
