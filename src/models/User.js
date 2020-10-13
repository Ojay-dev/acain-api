/* eslint-disable no-underscore-dangle */
import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true
    },
    lastname: {
      type: String,
      required: true,
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
    about: {
      type: String
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    membershipType: {
      type: String,
      default: 'associate_membership',
      enum: ['associate_membership', 'full_membership']
    },
    profession: {
      isAuthor: {
        type: Boolean,
        default: false
      },
      isIllustrator: {
        type: Boolean,
        default: false
      }
    },
    app_role: {
      type: String,
      enum: ['user', 'board_member', 'admin'],
      default: 'user'
    },
    lastPayment: Date,
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
