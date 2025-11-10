import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  trakt_id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true }, // ✅ Add this
  title: { type: String, required: true },
  overview: { type: String, default: "" },
  poster_path: { type: String, default: "" },
  backdrop: { type: String, default: "" },
  genres: { type: [String], default: [] },
  cast: { type: [String], default: [] },
  released: { type: String, default: "" },
  languages: { type: [String], default: [] },
  year: { type: Number },
  runtime: { type: Number, default: 0 },
  votes: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Movie", movieSchema);
