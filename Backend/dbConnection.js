const mongoose = require('mongoose')

const URL = process.env.MONGO_URL

async function dbConnect() {
  try {
    await mongoose.connect(URL);
    console.log("Database Connected...");
  } catch (error) {
    console.log(`Couldn't connect to database, ERROR: ${error}`);
  }
}

module.exports = dbConnect
