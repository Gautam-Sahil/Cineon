import { inngest } from "../inngest/index.js";
import Booking from "../model/Bookings.js";
import Show from "../model/Show.js";
import Stripe from "stripe";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Utility: Check if seats are available
const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats || {};
    // Check if any selected seat is already taken
    const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
    return !isAnySeatTaken;
  } catch (error) {
    console.error("checkSeatsAvailability error:", error.message);
    return false;
  }
};

// ✅ Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth(); // Middleware injects userId
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    if (!showId || !selectedSeats?.length) {
      return res.status(400).json({ success: false, message: "Invalid booking data." });
    }

    // 1️⃣ Check seat availability
    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return res.status(400).json({ success: false, message: "Selected seats are already booked." });
    }

    // 2️⃣ Fetch show data
    const showData = await Show.findById(showId).populate("movie");
    if (!showData) {
      return res.status(404).json({ success: false, message: "Show not found." });
    }

    // 3️⃣ Create booking in DB
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
      isPaid: false,
    });

    // 4️⃣ Update occupiedSeats in Show
    if (!showData.occupiedSeats) showData.occupiedSeats = {};
    selectedSeats.forEach(seat => {
      showData.occupiedSeats[seat] = userId;
    });

    showData.markModified("occupiedSeats");
    await showData.save();

    // 5️⃣ Create Stripe checkout session
    const lineItems = [
      {
        price_data: {
          currency: "SGD",
          product_data: { name: showData.movie.title },
          unit_amount: Math.round(booking.amount * 100), // convert to cents
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/loading/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      metadata: { bookingId: booking._id.toString() },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 mins from now
    });

    // Save Stripe payment link to booking
    booking.paymentLink = session.url;
    await booking.save();

    // run ingest sheduler funtion to check payment stauts after 10 minutes
    await inngest.send({
      name: "app/checkpoint",
      data: {
        bookingId: booking._id.toString()
      }
    })

    return res.status(200).json({ success: true, url: session.url, bookingId: booking._id });
  } catch (error) {
    console.error("createBooking error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get occupied seats for a show
export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);

    if (!showData) {
      return res.status(404).json({ success: false, message: "Show not found." });
    }

    const occupiedSeats = Object.keys(showData.occupiedSeats || {});
    return res.status(200).json({ success: true, occupiedSeats });
  } catch (error) {
    console.error("getOccupiedSeats error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
