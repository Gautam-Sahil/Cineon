import mongoose from "mongoose";

const bookingsSchema = new mongoose.Schema({
    user: {type: String, required: true, ref: "user"},
     show: {type: String, required: true, ref: "Show"},
     amount: {type: Number, required: true},
       bookedSeats: {type: Array, required: true},
        ispaid: {type: Boolean, default: false},
       paymentLink: {type: String},
},
     {timestamps: true}
)

const Booking = mongoose.model('Booking', bookingsSchema);

export default Booking;