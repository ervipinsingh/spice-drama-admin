import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://spice-drama:22atulVERMA@spice-drama-db.kzfylbu.mongodb.net/resturant ",
    )
    .then(() => console.log("DB Connected"));
};
