/* eslint-disable no-underscore-dangle */
import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    emailIsVerified: {
      type: Boolean,
      default: false
    },
    emailVerifiedAt: Date,
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    phoneIsVerified: {
      type: Boolean,
      default: false
    },
    phoneVerifiedAt: Date,
    avatar: String,
    facebook: String,
    twitter: String,
    linkedIn: String
  },
  { timestamps: true }
);

UserSchema.pre('save', async function preSave(next) {
  if (this.isModified('password')) {
    this.password = await this.encrypt(this.password);
  }
  next();
});

UserSchema.methods = {
  encrypt: async (password) => {
    if (!password) return '';
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },
  authenticate: async function auth(password) {
    return bcrypt.compare(password, this.password);
  },
  toJSON: function toJSON() {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
  }
};

export default model('user', UserSchema);
