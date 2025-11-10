import express from "express";
import { getFavorites, getUserBookingds, updateFavorite } from "../controller/UserController.js";

const userRouter = express.Router();

userRouter.get('/bookings', getUserBookingds);

userRouter.post('/update-favorite', updateFavorite); // ✅ FIXED
userRouter.get('/favorites', getFavorites);

export default userRouter;
