import { model, Schema } from 'mongoose';

const PublicationSchema = new Schema(
  {
    image: String,
    title: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user'
    },
    description: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default model('publication', PublicationSchema);
