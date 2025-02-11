const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    profileComplete: { type: Boolean, default: false },
    name: String,
    age: Number,
    gender: String,  // ✅ Added gender field
    profileImage: String,
});

module.exports = mongoose.model("User", UserSchema);
