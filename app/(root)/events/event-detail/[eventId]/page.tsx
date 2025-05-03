import type { Metadata } from "next";
import EventDetails from "./EventDetails";

export const metadata: Metadata = {
  title: "Eventhub | Event details",
  description: "Event details page",
};

export default function CreatePage() {
  return <EventDetails />;
}
