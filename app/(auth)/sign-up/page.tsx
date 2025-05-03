import type { Metadata } from "next";
import SignUp from "./SignUp";

export const metadata: Metadata = {
  title: "Eventhub | sign-up",
  description: "Eventhub signUp page",
};

export default function CreatePage() {
  return <SignUp />;
}
