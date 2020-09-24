/* eslint-disable arrow-body-style */
/* eslint-disable operator-linebreak */
import sendGrid from '@sendgrid/mail';
import Formidable from 'formidable';
import cloudinary from 'cloudinary';
import { customError } from '../errors';

export const duplicateCheck = async (Model, param) => {
  const check = await Model.findOne(param);
  if (check) {
    return true;
  }
  return false;
};
export const parallelRequests = (...args) => {
  const arr = args.map((arg) => {
    const func = arg.splice(0, 1)[0];
    return func(...arg);
  });
  return Promise.all(arr);
};
export const sendMail = (to, subject, html) => {
  if (!to) {
    throw new Error('Please provide a valid email to send to');
  }
  sendGrid.setApiKey(process.env.SENDGRID_API_KEYS);
  const payload = {
    to,
    from: process.env.EMAIL_FROM,
    subject,
    html
  };
  return sendGrid.send(payload);
};
export const strRandom = async (length = 10, accept, invert = false) => {
  if (typeof accept !== 'function') {
    accept = () => true;
  }
  const rawMaterials = 'abcdefghijklmnopqrstuvwxyz';
  const factory = (startValue = '') => {
    if (startValue.length >= length) return startValue;
    const choice = rawMaterials.charAt(
      Math.floor(Math.random() * rawMaterials.length)
    );
    startValue += Math.random() > 0.5 ? choice.toUpperCase() : choice;
    return factory(startValue);
  };
  const result = factory();
  const check = await accept(result);
  if (!check && invert) {
    return result;
  }
  if (check && !invert) {
    return result;
  }
  return strRandom(length, accept);
};
export const uploadFile = async (req, key, options, cb) => {
  return new Promise((resolve, reject) => {
    cb =
      cb && typeof cb === 'function'
        ? cb
        : (err, res) => {
            if (err) {
              return reject(err);
            }
            return resolve(res);
          };
    if (
      !req.headers['content-type'] ||
      req.headers['content-type'].indexOf('multipart/form-data;') === -1
    ) {
      return cb(
        customError(
          'use multipart/form-data content-type header for this',
          'Bad Request',
          400,
          false
        )
      );
    }
    const form = new Formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        return cb(err);
      }
      if (!files[key]) {
        return cb(
          customError(`${key} is required`, 'Validation Error', 422, false)
        );
      }
      const cloud = cloudinary.v2;
      cloud.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
      });
      return cloud.uploader.upload(
        files[key].path,
        options,
        async (error, result) => {
          if (error) {
            return cb(error);
          }
          return cb(null, result);
        }
      );
    });
  });
};
export default {
  duplicateCheck,
  parallelRequests
};
