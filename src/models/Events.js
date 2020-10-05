import mongoose, { model, Schema } from 'mongoose';

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

export default mongoose.models.event || model('event', EventsSchema);
