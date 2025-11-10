import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
 movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },

  showDateTime: { type: Date, required: true },
  showPrice: { type: Number, required: true },
  occupiedSeats: { type: Object, default: {} },
}, { timestamps: true });

export default mongoose.model("Show", showSchema);
