import { model, Schema } from 'mongoose';

const PaymentSchema = new Schema(
  {
    transRef: {
      unique: true,
      type: String,
      required: true
    },
    isConfirmed: {
      type: Boolean,
      default: false
    },
    amount: {
      type: Number,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    link: String,
    membershipType: {
      type: String,
      default: 'associate_membership',
      enum: ['associate_membership', 'full_membership']
    },
    flutterwaveID: String
  },
  { timestamps: true }
);

export default model('payment', PaymentSchema);
