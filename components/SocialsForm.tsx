"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { getUserByEmail, updateSocials } from "@/lib/actions/user.actions";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";

const SocialsForm: React.FC = () => {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition() as [
    boolean,
    (callback: () => void) => void
  ];

  const [form, setForm] = useState({
    instagram: "",
    facebook: "",
    twitter: "",
    linkedIn: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function fetchUser() {
    if (!session?.user?.email) return;
    try {
      const res = await getUserByEmail(session.user.email);

      // Pre-fill form with existing data
      if (res?.socials) {
        setForm({
          instagram: res.socials.instagram || "",
          facebook: res.socials.facebook || "",
          twitter: res.socials.twitter || "",
          linkedIn: res.socials.linkedIn || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [session?.user?.email]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!session?.user?.email) {
      return;
    }

    const formData = new FormData();
    formData.append("instagram", form.instagram);
    formData.append("facebook", form.facebook);
    formData.append("twitter", form.twitter);
    formData.append("linkedIn", form.linkedIn);

    startTransition(async () => {
      const result = await updateSocials(session.user.email as string, formData);
      if (result.success) {
        window.location.reload();
      }
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="w-full grid md:grid-cols-2 gap-5 pt-5">
        <div>
          <Label htmlFor="instagram">Instagram handle</Label>
          <Input
            id="instagram"
            name="instagram"
            placeholder="Instagram"
            value={form.instagram}
            onChange={handleChange}
            className="border mt-1"
          />
        </div>
        <div>
          <Label htmlFor="facebook">Facebook handle</Label>
          <Input
            id="facebook"
            name="facebook"
            placeholder="Facebook"
            value={form.facebook}
            onChange={handleChange}
            className="border mt-1"
          />
        </div>
        <div>
          <Label htmlFor="twitter">Twitter handle</Label>
          <Input
            id="twitter"
            name="twitter"
            placeholder="Twitter"
            value={form.twitter}
            onChange={handleChange}
            className="border mt-1"
          />
        </div>
        <div>
          <Label htmlFor="linkedIn">LinkedIn handle</Label>
          <Input
            id="linkedIn"
            name="linkedIn"
            placeholder="LinkedIn"
            value={form.linkedIn}
            onChange={handleChange}
            className="border mt-1"
          />
        </div>
      </div>

      <div className="flex justify-end pt-5">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-violet-500 hover:bg-violet-600 cursor-pointer"
        >
          {isPending ? "Updating..." : "Edit Socials"}
        </Button>
      </div>
    </form>
  );
};

export default SocialsForm;
