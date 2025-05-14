"use client";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MoveLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z
    .string()
    .min(2, {
      message: "Email must be at least 2 characters.",
    })
    .email({
      message: "Please enter a valid email address.",
    }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  avatar: z.any().optional(),
});

const SignUp = () => {
  const [isClick, setIsClick] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      avatar: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsClick(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    if (values.avatar) {
      formData.append("avatar", values.avatar);
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }
      router.push("/sign-in");
    } catch (error) {
      alert( error || "Something went wrong while registering.");
    }
  }

  return (
    <div className="relative h-screen w-screen flex justify-center bg-violet-100">
      <div className="w-[90%] md:w-96  absolute top-20 bg-white rounded-xl shadow-lg flex flex-col p-5 ">
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold font-montserrat">Sign Up</h1>
            <Link href="/">
              <MoveLeft className="text-gray-600" />
            </Link>
          </div>

          <p className="text-sm text-gray-500 font-inter ">
            to continue to Eventhub
          </p>
        </div>

        <div className="pt-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="john Doe" {...field} name="name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john@gmail.com"
                        {...field}
                        name="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="password"
                          {...field}
                          name="password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute cursor-pointer right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 "
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="text-gray-400" />
                          ) : (
                            <Eye className="text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatar"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel>Profile Image (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => {
                          onChange(e.target.files?.[0]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isClick}
                className="w-full bg-violet-600 hover:bg-violet-600 cursor-pointer"
              >
                Continue
              </Button>
            </form>
          </Form>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-inter mt-4">
            Already have an account?
            <Link href="/sign-in">
              <span className="text-violet-600 cursor-pointer">Sign In</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
