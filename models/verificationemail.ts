import mongoose from "mongoose"

const VerificationEmailSchema = new mongoose.Schema({
    email: {type: String, required: true},
    code: {type: String, required: true},
    expiresAt: {type: Date, required: true},
})

VerificationEmailSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const VerificationEmail = mongoose.models.VerificationEmail || mongoose.model('VerificationEmail', VerificationEmailSchema)
export default VerificationEmail