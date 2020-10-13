import { model, Schema } from 'mongoose';

const EventsSchema = new Schema(
  {
    eventDate: {
      type: Date,
      required: true
    },
    venue: {
      type: String,
      required: true
    },
    note: String,
    description: {
      type: String,
      required: true
    },
    image: String
  },
  { timestamps: true }
);

export default model('event', EventsSchema);
