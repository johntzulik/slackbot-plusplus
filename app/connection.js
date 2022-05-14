//Database connection Mongo
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const databaseConnection = async () => {
  await mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // ssl: true
    })
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      // we will not be here...
      console.error("App starting error:", err.stack);
      process.exit(1);
    });
};
module.exports = { databaseConnection };
