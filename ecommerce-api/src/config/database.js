import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbConnection = async () => {
  try {
    const dbURI = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;

    const connectionString = dbName ? `${dbURI}/${dbName}` : dbURI;

    await mongoose.connect(connectionString, {
      // If you use MongoDB < 8 you have to use this:
      //useNewUrlParser:true,
      //useUnifiedTopology:true
    });

    console.log(`MongoDB is connected`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default dbConnection;