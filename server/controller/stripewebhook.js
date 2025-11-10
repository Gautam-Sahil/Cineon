import stripe from "stripe";

import Booking from "../model/Bookings.js";

export const stripeWebhooks = async(request, response) =>{
    const stripeInstance = new stripe(process.env.STRIPE_WEBHOOK_SECRET);
    const sig = request.headers["stripe-signature"];

    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        return response.status(400).send(`webhooks error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded":{
                const paymentIntent = event.data.object;
                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                })

                const session = sessionList.data[0];
                const { bookingId } = session.metadata;

                await Booking.findByIdAndUpdate(bookingId,{
                    ispaid: true,
                    paymentLink: ""
                })
                
                break;
            }
                
               
        
            default:
                console.log("unhandled event type:", event.type)
        }
        response.json({recieved: true})
    } catch (error) {
        console.error("webhook processing:", error);
        response.status(500).send("internal server errror");
    }
}