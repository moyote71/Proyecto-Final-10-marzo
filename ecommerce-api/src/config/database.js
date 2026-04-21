import mongoose from 'mongoose';

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "ecommerce-db",
    });

    console.log("✅ MongoDB connected");
    console.log("📦 DB:", mongoose.connection.name);

  } catch (error) {
    console.log("❌ Error Mongo:", error);
    process.exit(1);
  }
};

export default dbConnection;