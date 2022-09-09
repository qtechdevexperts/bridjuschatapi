const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userPassword: {
        type: String,
        required: true
    },
    userFamilyTrees: [{ type: String, ref: 'trees', }],

    userDOB: {
        type: String,
        required: true
    },
    userGender: {
        type: String,
        required: true
    },
    userAbout: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    notification: {
        type: String,
        default: "on",
        trim: true,
    },
    is_notification: {
        type: Number,
        default: 1,
        trim: true,
    },

});

userSchema.virtual('userID').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true
});

exports.User = mongoose.model('users', userSchema)
exports.userSchema = userSchema;


// userDOB: {
//     type: String,
//     // required: true
// },
// userGender: {
//     type: String,
//     // required: true
// },
// userAbout: {
//     type: String,
//     // required: false
// },
// image: {
//     type: String,
//     required: false,
//   