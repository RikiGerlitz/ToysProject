
const mongoose = require('mongoose');
const {config} =require("../config/secret")

main().catch(err => console.log(err));

async function main() {
    mongoose.set('strictQuery' , false);
    
  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster1.sly989d.mongodb.net/toys-project`);
  console.log("mongo connect toys-project")
  
}