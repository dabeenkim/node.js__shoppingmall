const mongoose = require("mongoose");

const UserSchema = new mongoose.UserSchema({
    email:{
        type: String,
        required: true, //필수값
        unique: true,  //동일한 정보가 없도록
    },
    nickname:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },

});

UserSchemaSchema.virtual("userId").get(function() {
    return this._id.toHexString();
});

UserSchema.set("toJSON", {
    virtuals: true,  //json형태로 가공할 때 userId를 출력시켜줌
});

module.exports = mongoose.model("User", UserSchema);
