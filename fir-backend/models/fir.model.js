const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const {ObjectId} = mongoose.Types
    
const FIRSchema = new Schema({
    citizen: {
      type: ObjectId,
      ref: "users",
      required: true,
    },
    citizenEmail: {
      type: String, 
      required: [true, 'Please provide an email'], 
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    typeOfCrime: {
      type: String,
      required: [true,'Please provide the type of Crime'],
      enum: ["Theft", "Assault", "Fraud", "Murder", "Other"],
    },
    description: {
      type: String,
      required: [true,'Please provide the description'],
    },
    placeOfCrime: {
      type: String,
      required: [true,'Please provide the place of Crime'],
    },
    location: {
      type: String,
      required: [true, 'Please provide the location']
    },
    status: {
      type: String,
      enum: ["Filed", "Under Investigation", "Resolved", "Rejected"],
      default: "Filed",
    },
    assignedPolice: {
      type: ObjectId,
      ref: "users",
      default: null, // Initially no police assigned
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
});   

FIRSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const FIRModel = model("FIR", FIRSchema)

module.exports = FIRModel;