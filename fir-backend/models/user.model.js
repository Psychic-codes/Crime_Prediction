const mongoose = require("mongoose");
const { Schema,model } = mongoose; 
const ObjectId = mongoose.Types.ObjectId
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
  fullname:{
    firstname: {
      type: String,
      required: [true,'Please provide the first name'],
      minlength: [3,'First name must be atleast 3 characters'],
    },
    lastname:{
      type:String,
      required: [true,'Please provide the last name'],
      minlength: [3,'Last name must be atleast 3 characters'],
    }
  },
  email: { 
    type: String, 
    required: [true, 'Please provide an email'], 
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: { 
    type: String, 
    required: [true,'Please provide the password'],
    minlength: 6,
    select: false, 
  },
  role: { 
    type: String, 
    enum: ["CITIZEN", "POLICE"], 
    required: [true,'Please provide the role'] 
  },
  location: { 
    type: String, 
    required: [true,'Please provide the location'] 
  },
},
 { timestamps: true }
);

UserSchema.pre("save", function (next) {
  if (!this.fullname.firstname || this.fullname.firstname.length < 3) {
    return next(new Error("First name must be at least 3 characters"));
  }
  if (!this.fullname.lastname || this.fullname.lastname.length < 3) {
    return next(new Error("Last name must be at least 3 characters"));
  }
  next();
});

UserSchema.pre('save',async function(next){
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)
}

UserSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const UserModel = model("users",UserSchema)

module.exports = UserModel;
