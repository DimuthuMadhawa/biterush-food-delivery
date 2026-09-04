import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// Helper: Generate JWT Token
const createToken = (id) => {
  const secret = process.env.JWT_SECRET || "biterush_secret_key_2026_secure";
  return jwt.sign({ id }, secret, { expiresIn: "7d" });
};

// 1. LOGIN USER (Strict DB & bcrypt Verification)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Verify Email Exists in DB
    const user = await userModel.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // If account was created via Google without a password
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "This account uses Google Sign-In. Please click Signed in with Google."
      });
    }

    // 2. Verify Password Hash using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // 3. Issue JWT Token on Successful Verification
    const token = createToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone || "",
        avatar: user.profile_image || "",
        rewardPoints: user.reward_points || 388,
        balance: user.balance || 12000,
        isLoggedIn: true
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login. Please try again."
    });
  }
};

// 2. REGISTER USER (Validation + Duplicate Check + bcrypt Hashing)
const registerUser = async (req, res) => {
  const { firstName, lastName, email, phone, password, confirmPassword } = req.body;

  try {
    // 1. Basic Required Validation
    if (!firstName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields."
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? phone.trim() : "";

    // 2. Email Format Validation
    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    // 3. Password Strength Rule: Min 8 chars, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^()_-])[A-Za-z\d@$!%*?&#^()_-]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long and contain a lowercase letter, number, and special character (@$!%*?&#)."
      });
    }

    // 4. Confirm Password Match Check
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match."
      });
    }

    // 5. Duplicate Account Check (Email or Phone)
    const existingUser = await userModel.findOne({
      $or: [
        { email: cleanEmail },
        ...(cleanPhone ? [{ phone: cleanPhone }] : [])
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email or phone number already exists."
      });
    }

    // 6. Secure Password Hashing with bcryptjs (Salt rounds: 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 7. Save User to DB
    const userData = {
      first_name: firstName.trim(),
      last_name: lastName ? lastName.trim() : "",
      email: cleanEmail,
      password: hashedPassword,
      email_verified: true
    };

    if (cleanPhone) {
      userData.phone = cleanPhone;
    }

    const newUser = new userModel(userData);
    const user = await newUser.save();
    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone || "",
        rewardPoints: user.reward_points,
        balance: user.balance || 12000,
        isLoggedIn: true
      }
    });

  } catch (error) {
    console.error("Registration Error:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || 'email';
      const fieldName = field === 'email' ? 'email address' : 'phone number';
      return res.status(400).json({
        success: false,
        message: `An account with this ${fieldName} already exists.`
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || "Server error during registration. Please try again."
    });
  }
};

// 3. GOOGLE SIGN IN USER
const googleLoginUser = async (req, res) => {
  const { email, name, avatar, googleId } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ success: false, message: "Google profile email missing." });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = await userModel.findOne({ email: cleanEmail });

    if (!user) {
      const nameParts = (name || "Google User").split(" ");
      const firstName = nameParts[0] || "Google";
      const lastName = nameParts.slice(1).join(" ") || "User";

      user = new userModel({
        first_name: firstName,
        last_name: lastName,
        email: cleanEmail,
        google_id: googleId || "google_" + Date.now(),
        profile_image: avatar || "",
        email_verified: true
      });
      await user.save();
    } else {
      if (avatar && !user.profile_image) {
        user.profile_image = avatar;
        await user.save();
      }
    }

    const token = createToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        avatar: user.profile_image || avatar || "",
        rewardPoints: user.reward_points || 388,
        balance: user.balance || 12000,
        isLoggedIn: true
      }
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({ success: false, message: "Google authentication failed." });
  }
};

// 4. GET AUTHENTICATED USER PROFILE
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone || "",
        avatar: user.profile_image || "",
        rewardPoints: user.reward_points,
        balance: user.balance || 12000,
        isLoggedIn: true
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch user profile." });
  }
};

// 5. ADMIN LOGIN
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@biterush.com";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@1234";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create a token for admin. We can use a special ID or string.
      const token = createToken("admin_" + ADMIN_EMAIL);
      return res.json({
        success: true,
        token,
        message: "Admin authenticated successfully."
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials."
      });
    }
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during admin login."
    });
  }
};

export { loginUser, registerUser, googleLoginUser, getUserProfile, adminLogin };
