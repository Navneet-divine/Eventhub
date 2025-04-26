"use client";

import { signOut } from "next-auth/react";

const Logout: React.FC = () => {
  return (
    <>
      <button onClick={() => signOut()} className="mt-4 text-red-500">
        Logout
      </button>
    </>
  );
};

export default Logout;
