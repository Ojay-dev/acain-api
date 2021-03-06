import mongoose from 'mongoose';

const configureDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
  } catch (error) {
    console.log('Unable to connect to MongoDB: ', error);
  }
};

export default configureDB;
