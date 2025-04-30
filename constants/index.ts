export const NAV_LINK = [
    {
        label: "Home",
        route: "/home",
    },
    {
        label: "Create Event",
        route: "/events/create-event",
    },
    {
        label: "My Events",
        route: "/my-events",

    },
];

export const eventDefaultValues = {
    title: '',
    description: '',
    location: '',
    imageUrl: '',
    startDateTime: new Date(),
    endDateTime: new Date(),
    categoryId: '',
    price: '',
    isFree: false,
    url: '',
}