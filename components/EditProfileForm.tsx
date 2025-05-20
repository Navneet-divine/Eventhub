"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { editProfile } from "@/lib/actions/user.actions";
import { useSession } from "next-auth/react";

interface Props {
  onUpdate?: () => void;
}

const EditProfileForm: React.FC<Props> = ({ onUpdate }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    avatar: null as File | null,
    phoneNo: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value, files } = e.target;
    if (id === "avatar" && files) {
      setForm((prev) => ({ ...prev, avatar: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [id]: value }));
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user.email) return;

    const formData = new FormData();
    formData.append("oldPassword", form.oldPassword);
    formData.append("newPassword", form.newPassword);
    formData.append("email", form.email);
    formData.append("phoneNo", form.phoneNo);
    if (form.avatar) formData.append("avatar", form.avatar);

    try {
      setLoading(true);
      const result = await editProfile(session.user.email, formData);
      console.log("Edit result:", result);

      if (result.success) {
        setForm({
          email: "",
          oldPassword: "",
          newPassword: "",
          avatar: null,
          phoneNo: "",
        });

        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Error editing profile:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="w-full grid md:grid-cols-2 gap-5 pt-5">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="email"
            value={form.email}
            onChange={handleChange}
            className="border mt-1"
          />
        </div>
        <div>
          <Label htmlFor="oldPassword">Old Password</Label>
          <Input
            id="oldPassword"
            type="password"
            placeholder="old password"
            value={form.oldPassword}
            onChange={handleChange}
            className="border mt-1"
          />
        </div>
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="new password"
            value={form.newPassword}
            onChange={handleChange}
            className="border mt-1"
          />
        </div>
        <div>
          <Label htmlFor="phoneNo">Phone No</Label>
          <Input
            id="phoneNo"
            placeholder="Phone No"
            value={form.phoneNo}
            onChange={handleChange}
            className="border mt-1 cursor-pointer"
          />
        </div>
      </div>
      <div className="flex justify-end pt-5">
        <Button
          type="submit"
          disabled={loading}
          className={`cursor-pointer ${
            loading ? "bg-violet-400" : "bg-violet-500 hover:bg-violet-600"
          }`}
        >
          {loading ? "Updating..." : "Edit Profile"}
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;
