import type { Metadata } from "next";
import MyEvent from "./MyEvents";

export const metadata: Metadata = {
  title: "Eventhub | My Events",
  description: "My Events page",
};

export default function CreatePage() {
  return <MyEvent />;
}
