import { Inngest } from "inngest";
import connectDB from "../config/db.js";
import User from "../model/User.js";
import AuditLog from "../model/AuditLog.js";
import Booking from "../model/Bookings.js";
import Show from "../model/Show.js";

import { sendEmail } from "../config/emailservice.js";

// Initialize Inngest client
export const inngest = new Inngest({ id: "movie-ticket-booking" });


// Helper to write audit logs
async function logAudit({ eventName, functionName, userId, status, message, data, error }) {
     try {
    await AuditLog.create({
   eventName,
   functionName,
   userId,
   status,
   message,
   data,
   error: error ? { message: error.message, stack: error.stack } : undefined,
    });
     } catch (err) {
    console.error("Failed to write audit log:", err);
     }
}

/**
    * Clerk user.created → create MongoDB user
    */
const syncUserCreation = inngest.createFunction(
     { id: "sync-user-from-clerk", name: "Sync user from Clerk (Create)" },
     { event: "clerk/user.created" },
     async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const email = email_addresses?.[0]?.email_address;
    const name = `${first_name || ""} ${last_name || ""}`.trim();

    try {
   if (!email) {
        await logAudit({
       eventName: event.name,
       functionName: "sync-user-from-clerk",
       userId: id,
       status: "error",
       message: "Skipped - missing email",
       data: event.data,
        });
        return { message: "Skipped - missing email" };
   }

   const existingUser = await User.findById(id);
   if (existingUser) {
        await logAudit({
       eventName: event.name,
       functionName: "sync-user-from-clerk",
       userId: id,
       status: "success",
       message: "User already exists",
        });
        return { message: "User already exists" };
   }

   const userData = { _id: id, email, name, image: image_url };
   await User.create(userData);

   await logAudit({
        eventName: event.name,
        functionName: "sync-user-from-clerk",
        userId: id,
        status: "success",
        message: "User created successfully",
        data: userData,
   });

   return { message: "User created successfully", user: userData };
    } catch (error) {
   await logAudit({
        eventName: event.name,
        functionName: "sync-user-from-clerk",
        userId: id,
        status: "error",
        message: "User creation failed",
        data: event.data,
        error,
   });
   throw error;
    }
     }
);

/**
    * Clerk user.updated → update MongoDB user
    */
const syncUserUpdation = inngest.createFunction(
     { id: "update-user-from-clerk", name: "Sync user from Clerk (Update)" },
     { event: "clerk/user.updated" },
     async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const email = email_addresses?.[0]?.email_address;
    const name = `${first_name || ""} ${last_name || ""}`.trim();

    try {
   const userData = { email, name, image: image_url };
   const updated = await User.findByIdAndUpdate(id, userData, {
        new: true,
        runValidators: true,
   });

   if (!updated) {
        await User.create({ _id: id, ...userData });
        await logAudit({
       eventName: event.name,
       functionName: "update-user-from-clerk",
       userId: id,
       status: "success",
       message: "User not found - created instead",
       data: userData,
        });
        return { message: "User not found - created instead" };
   }

   await logAudit({
        eventName: event.name,
        functionName: "update-user-from-clerk",
        userId: id,
        status: "success",
        message: "User updated successfully",
        data: userData,
   });

   return { message: "User updated successfully", user: updated };
    } catch (error) {
   await logAudit({
        eventName: event.name,
        functionName: "update-user-from-clerk",
        userId: id,
        status: "error",
        message: "User update failed",
        data: event.data,
        error,
   });
   throw error;
    }
     }
);

/**
    * Clerk user.deleted → delete MongoDB user
    */
const syncUserDeletion = inngest.createFunction(
     { id: "delete-user-with-clerk", name: "Delete user from Clerk" },
     { event: "clerk/user.deleted" },
     async ({ event }) => {
    const { id } = event.data;

    try {
   const deleted = await User.findByIdAndDelete(id);

   if (!deleted) {
        await logAudit({
       eventName: event.name,
       functionName: "delete-user-with-clerk",
       userId: id,
       status: "success",
       message: "User not found, no action taken",
        });
        return { message: "User not found, no action taken" };
   }

   await logAudit({
        eventName: event.name,
        functionName: "delete-user-with-clerk",
        userId: id,
        status: "success",
        message: "User deleted successfully",
   });

   return { message: "User deleted successfully", userId: id };
    } catch (error) {
   await logAudit({
        eventName: event.name,
        functionName: "delete-user-with-clerk",
        userId: id,
        status: "error",
        message: "User deletion failed",
        error,
   });
   throw error;
    }
     }
);

// 🛑 REMOVED: The redundant releaseSeatsAndDeleteBooking function is deleted here.

const bookingEmailHandler = inngest.createFunction(
     {
    id: "booking-email-professional",
    name: "Booking Email Notifications (Professional)",
     },
     {
    event: "app/booking.*",
     },
     async ({ event, step }) => {
    // 🔹 Connect to MongoDB first
    // NOTE: connectDB is often unnecessary in Vercel/Inngest environments if connection is global, 
    // but kept here for stability based on original code.
    await connectDB(); 

    const { bookingId } = event.data;

    // 🔹 Fetch booking and populate user + show
   const booking = await Booking.findById(bookingId)
     .populate({
    path: "show",
    populate: { path: "movie" },
     })
     .populate("user");

    if (!booking) return;

    const user = booking.user;
    const show = booking.show;
    if (!user || !show) return;

    const seats = booking.bookedSeats.join(", ");
    const showTime = new Date(show.showDateTime).toLocaleString();

    // Common HTML header/footer
    const htmlHeader = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto;">`;
    const htmlFooter = `<p style="color: gray; font-size: 12px;">This is an automated email from Movie Ticket Booking App. Do not reply.</p></div>`;

    // ----------------------
    // 1️⃣ Pending payment email + Auto-check scheduling
    // ----------------------
    if (event.name === "app/booking.created") {
   const subject = "🎬 Your Booking is Pending Payment";
   const html = `
        ${htmlHeader}
        <h2 style="color:#1E3A8A;">Booking Pending</h2>
        <p>Hi ${user.name},</p>
        <p>Your booking for <strong>${show.movie.title}</strong> on <strong>${showTime}</strong> is pending payment. This reservation is held for 10 minutes.</p>
        <p><strong>Seats:</strong> ${seats}</p>
        <p><strong>Amount:</strong> $${booking.amount.toFixed(2)}</p>
        <img src="${show.movie.poster_path}" alt="${show.movie.title}" style="width:150px; border-radius:8px; margin-top:10px;">
        <p style="margin-top:15px;">
       <a href="${booking.paymentLink}" style="display:inline-block; background:#1E3A8A; color:white; padding:10px 20px; border-radius:5px; text-decoration:none;">
      Pay Now
       </a>
        </p>
        ${htmlFooter}
   `;
   await sendEmail({ to: user.email, subject, html });

   // ----------------------
   // 2️⃣ Schedule 10-minute auto-check (Cancellation logic)
   // ----------------------
   const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
   await step.sleepUntil("wait-10-minutes", tenMinutesLater);

   await step.run("check-payment", async () => {
        // Fetch the latest state of the booking
        const updatedBooking = await Booking.findById(bookingId);
        
        // If booking is paid OR doesn't exist (already deleted by someone else), STOP.
        if (!updatedBooking || updatedBooking.isPaid) return; 

        // Fetch the show details again to ensure we have the latest occupiedSeats map
        const latestShow = await Show.findById(updatedBooking.show);
        if (!latestShow) return; // Should not happen, but safe check

        // Release seats
        updatedBooking.bookedSeats.forEach(seat => {
       delete latestShow.occupiedSeats[seat];
        });
        latestShow.markModified("occupiedSeats");
        await latestShow.save(); // Save seat release

        // Delete booking
        await Booking.findByIdAndDelete(bookingId);

        // Send cancellation email
        const cancelSubject = "❌ Booking Canceled: Payment Timeout";
        const cancelHtml = `
       ${htmlHeader}
       <h2 style="color:#B91C1C;">Booking Canceled</h2>
       <p>Hi ${user.name},</p>
       <p>Your reservation for <strong>${show.movie.title}</strong> on <strong>${showTime}</strong> was automatically canceled because payment was not completed within the 10-minute hold period.</p>
       <p><strong>Seats:</strong> ${seats}</p>
       <p>Please rebook if you wish to secure your tickets.</p>
       <img src="${show.movie.poster_path}" alt="${show.movie.title}" style="width:150px; border-radius:8px; margin-top:10px;">
       ${htmlFooter}
        `;
        await sendEmail({ to: user.email, subject: cancelSubject, html: cancelHtml });
   });
    }

    // ----------------------
    // 3️⃣ Payment confirmed email
    // ----------------------
    if (event.name === "app/booking.paid") {
   const subject = "✅ Booking Confirmed!";
   const html = `
        ${htmlHeader}
        <h2 style="color:#047857;">Booking Confirmed</h2>
        <p>Hi ${user.name},</p>
        <p>Your booking for <strong>${show.movie.title}</strong> on <strong>${showTime}</strong> is confirmed. You're all set!</p>
        <p><strong>Seats:</strong> ${seats}</p>
        <p><strong>Amount Paid:</strong> $${booking.amount.toFixed(2)}</p>
        <img src="${show.movie.poster_path}" alt="${show.movie.title}" style="width:150px; border-radius:8px; margin-top:10px;">
        <p>Enjoy the movie! 🍿</p>
        ${htmlFooter}
   `;
   await sendEmail({ to: user.email, subject, html });
    }
     }
);

export const functions = [
     syncUserCreation,
     syncUserUpdation,
     syncUserDeletion,
     bookingEmailHandler, // 🛑 Only the robust handler remains
];