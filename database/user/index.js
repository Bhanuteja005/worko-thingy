import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  fullname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Invalid email"]
  },
  password: { type: String },
  age: { type: Number, required: true },
  city: { type: String, required: true },
  zipCode: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return validator.isPostalCode(value, 'US');
      },
      message: "Invalid zip code"
    }
  },
  deleted: { type: Boolean, default: false } 
},
{
  timestamps: true
});

UserSchema.methods.generateJwtToken = function() {
  return jwt.sign({ user: this._id.toString(), id: this.id }, "worko"); // Include id in JWT token
};

UserSchema.statics.findEmailAndPhone = async ({ email, phoneNumber }) => {
  const checkUserByEmail = await UserModel.findOne({ email });
  const checkUserByPhone = await UserModel.findOne({ phoneNumber });
  if (checkUserByEmail || checkUserByPhone) {
    throw new Error("User already exists");
  }
  return false;
};



UserSchema.statics.findByEmailAndPassword = async ({ email, password }) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("User does not exist");

  const doesPasswordMatch = await bcrypt.compare(password, user.password);
  if (!doesPasswordMatch) {
    throw new Error("Invalid password");
  }
  return user;
};

UserSchema.statics.findById = async (id) => {
  try {
    const objectId = mongoose.Types.ObjectId.isValid(id) ? mongoose.Types.ObjectId(id) : null; 
    const user = await UserModel.findOne({ _id: objectId || id });
    if (!user) throw new Error("User does not exist");
    return user;
  } catch (error) {
    throw new Error("Error finding user: " + error.message);
  }
};

UserSchema.pre("save", function(next) {
  const user = this;
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(8, (error, salt) => {
    if (error) return next(error);

    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error);
      user.password = hash;
      return next();
    });
  });
});

export const UserModel = mongoose.model("Users", UserSchema);