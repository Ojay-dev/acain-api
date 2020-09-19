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

export default {
  duplicateCheck,
  parallelRequests
};
