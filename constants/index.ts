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
        label: "Profile",
        route: "/profile",
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