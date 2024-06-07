import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();
    
    const secret = process.env.SECRET_KEY;
    const hash = crypto.createHmac('sha256', secret).update(this.password).digest('hex');
    this.password = bcrypt.hashSync(hash, 10);
    next();
});

const User = mongoose.model('User', userSchema);
export default User;
