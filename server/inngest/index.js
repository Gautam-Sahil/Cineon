import { Inngest } from "inngest";
import User from "../model/User.js";
import AuditLog from "../model/AuditLog.js";

// Initialize Inngest client
export const inngest = new Inngest({ id: "movie-ticket-booking" });

/**
 * Helper to write audit logs
 */
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

export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion];
