import EventForm from "../components/EventForm";

const CreateaEvent: React.FC = () => {
  return (
    <div className="px-5 lg:px-28 xl:px-40 ">
      <div className="flex justify-start py-5 md:pt-5 md:py-0">
        <h1 className="font-bold text-3xl font-inter">Create Event</h1>
      </div>
      <div>
        <EventForm />
      </div>
    </div>
  );
};

export default CreateaEvent;
