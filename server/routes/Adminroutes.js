import express from "express";
import { protectAdmin } from "../middleware/auth.js";
import { getAllBookings, getAllShows, getdashboardata, isAdmin } from "../controller/admincontroller.js";
 
const adminRouter = express.Router();

adminRouter.get('/is-admin', protectAdmin, isAdmin)

adminRouter.get('/dashboard', protectAdmin, getdashboardata)

adminRouter.get('/all-shows', protectAdmin, getAllShows)

adminRouter.get('/all-bookings', protectAdmin, getAllBookings)

export default adminRouter;