import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // Your secret key

export async function POST(req: Request) {
    const { eventTitle, eventPrice, eventId } = await req.json();

    try {
        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: eventTitle, // Title of the event
                        },
                        unit_amount: eventPrice * 100, // Price in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_STRIPE_API_URL}/events/event-detail/${eventId}?status=success`, // Updated to use new environment variable
            cancel_url: `${process.env.NEXT_PUBLIC_STRIPE_API_URL}/events/event-detail/${eventId}?status=cancel`, // Updated to use new environment variable
        });


        return new Response(JSON.stringify({ sessionId: session.id }), { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}
