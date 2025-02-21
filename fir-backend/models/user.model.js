const mongoose = require("mongoose");
const { Schema,model } = mongoose; 
const ObjectId = mongoose.Types.ObjectId

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["CITIZEN", "POLICE"], required: true },
  location: { type: String, required: true },
},
 { timestamps: true }
);

const UserModel = model("users",UserSchema)

module.exports = UserModel;
