const mongoose = require("mongoose");
const initData = require("./data.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("../models/listing.js");

main().
then(() => {
    console.log("Connected to DB successfully");
})
.catch((err) => {
    console.log(err);   
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner:'6a30f999d189f969382b3638'}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized successfully");
}

initDb();