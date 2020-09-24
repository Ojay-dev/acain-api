/* eslint-disable operator-linebreak */
import jwt from 'jsonwebtoken';

export const signToken = (payload) => {
  const token = jwt.sign(
    {
      exp:
        Date.now() +
        86400000 * (parseFloat(process.env.JWTExpireDays || 1) || 1),
      payload
    },
    process.env.JWTSecret
  );
  return token;
};
export const verifyToken = (token = '') => {
  token = token.replace('Bearer ', '');
  const payload = jwt.verify(token, process.env.JWTSecret);
  return payload;
};

export default {
  signToken,
  verifyToken
};
