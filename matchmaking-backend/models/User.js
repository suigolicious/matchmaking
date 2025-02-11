const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    phone: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    profileComplete: { 
        type: Boolean, 
        default: false 
    },
    name: { 
        type: String, 
        default: "" 
    },
    age: { 
        type: Number, 
        default: null 
    },
    gender: { 
        type: String, 
        enum: ["", "Male", "Female"], 
        default: "",
    },
    profileImage: { 
        type: String, 
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
