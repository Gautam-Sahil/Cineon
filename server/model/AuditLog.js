import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },  // e.g. clerk/user.created
    functionName: { type: String, required: true }, // e.g. sync-user-from-clerk
    userId: { type: String },
    status: { type: String, enum: ["success", "error"], default: "success" },
    message: { type: String },
    data: { type: Object }, // raw event or extra info
    error: { type: Object }, // error details if any
  },
  { timestamps: true }
);

export default mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
