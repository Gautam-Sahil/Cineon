import mongoose from "mongoose";

// Define the Cast Member Sub-Schema
const castMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  character: { type: String, default: "" },
  image: { type: String, default: null }, // Null if no image available
}, { _id: false }); // No need for separate IDs for cast members

const movieSchema = new mongoose.Schema({
  trakt_id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  overview: { type: String, default: "" },
  poster_path: { type: String, default: "" },
  backdrop: { type: String, default: "" },
  genres: { type: [String], default: [] },
  
  // 🚨 IMPORTANT: Update cast type to use the new sub-schema
  cast: { type: [castMemberSchema], default: [] }, 
  
  released: { type: String, default: "" },
  languages: { type: [String], default: [] },
  year: { type: Number },
  runtime: { type: Number, default: 0 },
  votes: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Movie", movieSchema);