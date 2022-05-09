const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    slackId:{type:String, require:true},
    puntos:{type:Number,required:true}
  },
  { timestamps: true }
);

let User = mongoose.model("User", UserSchema);

module.exports = User;
