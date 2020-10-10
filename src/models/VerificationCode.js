import { model, Schema } from 'mongoose';

const VerificationCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true
    },
    for: {
      type: String,
      required: true,
      enum: ['email', 'phone', 'password']
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user'
    },
    isUsed: {
      type: Boolean,
      default: false
    },
    expiresAt: Date
  },
  { timestamps: true }
);

// eslint-disable-next-line operator-linebreak
export default model('verification_code', VerificationCodeSchema);
