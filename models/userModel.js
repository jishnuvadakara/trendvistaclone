const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//declare the schema of mongodb model
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
// userSchema.pre("save",async function(next){
//     const salt=await bcrypt.genSaltSync(10)
//     this.password=await bcrypt.hash(this.password,salt)

// })

//export the model
const User = mongoose.model("User", userSchema);
module.exports = User;
