import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import mongoose_delete from 'mongoose-delete';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
	uid: { type: Number },
	email: { type: String },
	password: { type: String },
	name: { type: String, maxLength: 50 },
	phone: { type: Number },
	address: { type: String, maxLength: 50 },
	date: { type: Date },
	revenue: { type: Number },
	role: { type: String, enum: ['admin', 'staff'], default: 'staff', select: false },
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = bcrypt.hashSync(this.password, 12);
	if (this.isModified('password') || this.isNew) this.passwordChangedAt = Date.now() - 2000;
});

userSchema.methods.correctPassword = async function (candidatePass, currentPass) {
	return await bcrypt.compare(candidatePass, currentPass);
};

userSchema.methods.isPasswordChanged = async function (jwtTimeStamp) {
	if (this.passwordChangedAt) {
		const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
		return changedTimeStamp > jwtTimeStamp;
	}
	return false;
};

userSchema.methods.createPasswordResetToken = async function () {
	const resetToken = crypto.randomBytes(32).toString('hex');
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
	//Minutes
	this.passwordResetExpires = Date.now() + parseInt(process.env.EMAIL_RESET_PASSWORD_EXPIRES) * 60 * 1000;

	return resetToken;
};

userSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const User = mongoose.model('User', userSchema);

export default User;
