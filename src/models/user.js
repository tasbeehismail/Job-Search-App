import { Schema, model } from "mongoose";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    recoveryEmail: {
        type: String
    },
    DOB:{
        type: Date,
        required: true
    },
    mobileNumber: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        enum: ['User', 'Company_HR', 'Admin'],
        required: true
    },
    status:{
        type: String,
        enum: ['online', 'offline']
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    otp: {
        code: {
            type: String,
        },
        expiresAt: {
            type: Date,
        },
    }
}, { timestamps: true });

userSchema.virtual('username').get(function () {
    return `${this.firstName}_${this.lastName}`.toLowerCase();
});

const User = model('User', userSchema);
export default User;
