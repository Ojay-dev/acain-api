import sendGrid from '@sendgrid/mail';

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

export default {
  duplicateCheck,
  parallelRequests
};
