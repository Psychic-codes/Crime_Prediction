const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const {ObjectId} = mongoose.Types
    
const FIRSchema = new Schema({
    citizen: {
      type: ObjectId,
      ref: "users",
      required: true,
    },
    typeOfCrime: {
      type: String,
      required: true,
      enum: ["Theft", "Assault", "Fraud", "Murder", "Other"],
    },
    description: {
      type: String,
      required: true,
    },
    placeOfCrime: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
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