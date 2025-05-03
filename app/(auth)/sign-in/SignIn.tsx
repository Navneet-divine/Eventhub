"use client";

import Image from "next/image";
import googleLogo from "@/public/icons/google.webp";
import githubLogo from "@/public/icons/github.png";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

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
import Link from "next/link";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
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
});

const SignIn = () => {
  const [isClick, setIsClick] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsClick(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (res?.ok) {
        router.push("/home");
        toast.success("Successfully signed in!");
      } else {
        toast.error("Invalid credentials.");
      }
    } catch (error) {
      alert("Error signing in. Please try again.");
    }
  }

  return (
    <div className="relative h-screen w-screen flex justify-center bg-violet-100">
      <div className="w-[90%] md:w-96  absolute top-20 bg-white rounded-xl shadow-lg flex flex-col p-5 ">
        <div>
          <h1 className="text-xl font-bold font-montserrat">Sign In</h1>
          <p className="text-sm text-gray-500 font-inter ">
            to continue to Eventhub
          </p>
        </div>

        <div className="py-5 flex items-center flex-col gap-3">
          <div
            onClick={() =>
              signIn("google", { redirect: false, callbackUrl: "/home" })
            }
            className="flex items-center cursor-pointer w-full px-3 border rounded-sm p-2"
          >
            <Image src={googleLogo} alt="Google logo" width={20} height={20} />
            <p className="ml-3 font-inter text-gray-600 text-sm">
              Continue with Google
            </p>
          </div>
          <div
            onClick={() =>
              signIn("github", { redirect: true, callbackUrl: "/home" })
            }
            className="flex items-center cursor-pointer w-full px-3 border rounded-sm p-2 "
          >
            <Image src={githubLogo} alt="Github logo" width={20} height={20} />
            <p className="ml-3 font-inter text-gray-600 text-sm">
              Continue with Github
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 text-sm text-gray-500 font-inter">
          <p> or </p>
        </div>

        <div className="pt-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john" {...field} name="email" />
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
            Don't have an account?
            <Link href="/sign-up">
              <span className="text-violet-600 cursor-pointer">Sign Up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
