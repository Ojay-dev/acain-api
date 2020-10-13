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
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// eslint-disable-next-line operator-linebreak
export default model('publication', PublicationSchema);
