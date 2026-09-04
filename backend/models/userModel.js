import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, trim: true },
  last_name: { type: String, required: false, trim: true, default: "" },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: false, sparse: true, trim: true, default: undefined },
  password: { type: String, required: false }, // Optional for Google users
  email_verified: { type: Boolean, default: false },
  verification_token: { type: String, default: "" },
  google_id: { type: String, default: "" },
  profile_image: { type: String, default: "" },
  reward_points: { type: Number, default: 388 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  cart_data: { type: Object, default: {} },
  balance: { type: Number, default: 12000 }
}, { timestamps: true, minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
