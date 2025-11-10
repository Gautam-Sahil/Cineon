import Stripe from "stripe";
import Booking from "../model/Bookings.js";
import { inngest } from "../inngest/index.js";

export const stripeWebhooks = async (req, res) => {
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        // Find checkout session using payment_intent ID
        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
          limit: 1,
        });

        const session = sessionList.data[0];
        if (!session) {
          console.warn("No session found for payment intent:", paymentIntent.id);
          break;
        }

        const { bookingId } = session.metadata;

        // ✅ Correct field name: isPaid (not ispaid)
        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
          paymentLink: "",
        });

     await inngest.send({
  name: "app/booking.paid",
  data: { bookingId }
});

      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
