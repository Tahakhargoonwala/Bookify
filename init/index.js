require('dotenv').config();
const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require('../models/listing.js');
// const dbUrl=process.env.ATLASDb;
// console.log("Database URL:", dbUrl);
main()
    .then(()=>console.log("connected to DB 2"))
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/bookify');}


const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"66be18bc4db73207d29fe60e"}));
    await Listing.insertMany(initData.data);
    console.log("Data has initialized")
}

initDB();