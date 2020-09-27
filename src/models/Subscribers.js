import { model, Schema } from 'mongoose';

const SubscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    isSubscribed: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default model('subscriber', SubscriberSchema);
