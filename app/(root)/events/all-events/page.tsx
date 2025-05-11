import AllEvents from "../components/AllEvents";

export const metadata = {
  title: "Eventhub | All Events",
  description: "Browse all the events available on our platform.",
};

const AllEventsPage: React.FC = () => {
  return (
    <div>
      <AllEvents />
    </div>
  );
};

export default AllEventsPage;
