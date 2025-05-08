import feature1 from "@/public/images/feature1.webp"
import feature2 from "@/public/images/feature2.webp"
import feature3 from "@/public/images/feature3.webp"
import feature4 from "@/public/images/feature4.webp"

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

export const FEATURES = [
    {
        title: "Meet new people",
        text: "Meeting new like minded people was never easier. No matter what you love you will find people with the same interest on meethub.",
        image: feature1
    },
    {
        title: "Host a meetup",
        text: "Want to host a meetup yourself? Wait no further with meethub you can host a meetup in just a few steps with a clean and easy UI.",
        image: feature2
    },
    {
        title: "Make new friends",
        text: "Meeting people can help you learn and grow yourself. Innovative ideas come from the conversations you never had before.",
        image: feature3
    },
    // {
    //     title: "Meet new people",
    //     text: "Meeting people can help you learn and grow yourself. Innovative ideas come from the conversations you never had before.",
    //     image: feature4
    // }

]