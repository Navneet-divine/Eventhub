import type { Metadata } from "next";
import SignIn from "./SignIn";

export const metadata: Metadata = {
  title: "Eventhub | sign-in",
  description: "Eventhub signIn page",
};

export default function CreatePage() {
  return <SignIn />;
}
