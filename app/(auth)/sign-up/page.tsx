"use client";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const SignIn = () => {
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
    console.log(values);

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

      const data = await response.json();
      router.push("/dashboard");
    } catch (error) {
      alert("Something went wrong while registering.");
    }
  }

  return (
    <div className="relative h-screen w-screen flex justify-center bg-violet-100">
      <div className="w-[90%] md:w-96  absolute top-20 bg-white rounded-xl shadow-lg flex flex-col p-5 ">
        <div>
          <h1 className="text-xl font-bold font-montserrat ">Sign Up</h1>
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
                      <Input
                        placeholder="**********"
                        {...field}
                        name="password"
                      />
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
            <Link href="/sign-in">
              <span className="text-violet-600 cursor-pointer">Sign In</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
