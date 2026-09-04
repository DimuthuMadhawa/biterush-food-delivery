import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: false }, // Optional for now, assuming guest checkout
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Order Placed" },
    paymentMethod: { type: String, required: true },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false }
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
