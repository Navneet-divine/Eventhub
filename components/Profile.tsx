"use client";

import { getUserByEmail } from "@/lib/actions/user.actions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Instagram, Twitter, Facebook, Linkedin } from "lucide-react";
import Socials from "./Socials";
import SocialsForm from "./SocialsForm";
import EditProfileForm from "./EditProfileForm";

export default function Profile() {
  const { data: session } = useSession();

  interface User {
    name?: string;
    email?: string;
    color: string;
    avatar?: string;
    phoneNo?: string;
    socials: {
      instagram: "";
      facebook: "";
      twitter: "";
      linkedIn: "";
    };
  }

  const [user, setUser] = useState<User | null>(null);

  async function fetchUser() {
    if (!session?.user?.email) return;
    try {
      const res = await getUserByEmail(session.user.email);
      setUser(res);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [session?.user?.email]);

  return (
    <div className="px-5 lg:px-28 xl:px-40 pt-10 pb-10">
      <h1 className="text-4xl font-montserrat font-semibold">My Profile</h1>
      <div className="flex flex-col md:flex-row w-full gap-5 pt-5">
        {/* Left Column */}
        <div className="flex flex-col gap-5 md:w-[50%]">
          {/* Profile Card */}
          <div className="flex flex-col items-center p-5 border rounded-md h-60">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt="user avatar"
                width={100}
                height={100}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div
                className="flex justify-center items-center w-20 h-20 rounded-full text-white font-montserrat text-2xl"
                style={{ background: user?.color }}
              >
                {user?.name?.[0] ?? "?"}
              </div>
            )}
            <div className="pt-2">
              <h1 className="text-xl font-montserrat">{user?.name}</h1>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-inter">{user?.email}</p>
            </div>
            <div>
              {user?.phoneNo && (
                <p className="text-sm text-gray-500 font-inter">
                  +91 {user?.phoneNo}
                </p>
              )}
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="flex flex-col p-5 border rounded-md">
            <h2 className="text-lg font-montserrat text-gray-700">
              Edit Profile
            </h2>
            <EditProfileForm onUpdate={fetchUser} />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-5 md:w-[50%]">
          {/* Socials Display */}
          <div className="border rounded-md p-5">
            <Socials
              text={
                user?.socials?.instagram
                  ? user.socials.instagram
                  : "Not Provided"
              }
              logo={<Instagram />}
            />
            <Socials
              text={
                user?.socials?.facebook ? user.socials.facebook : "Not Provided"
              }
              logo={<Facebook />}
            />
            <Socials
              text={
                user?.socials?.twitter ? user.socials.twitter : "Not Provided"
              }
              logo={<Twitter />}
            />
            <Socials
              text={
                user?.socials?.linkedIn ? user.socials.linkedIn : "Not Provided"
              }
              logo={<Linkedin />}
            />
          </div>

          {/* Socials Form */}
          <div className="border rounded-md p-5">
            <h1 className="font-montserrat text-gray-500 text-lg">
              Add/Edit Your Socials
            </h1>
            <SocialsForm />
          </div>
        </div>
      </div>
    </div>
  );
}
