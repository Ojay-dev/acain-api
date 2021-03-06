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

// eslint-disable-next-line operator-linebreak
export default model('subscriber', SubscriberSchema);
