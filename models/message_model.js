const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    treeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trees',
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },


});

messageSchema.virtual('userID').get(function () {
    return this._id.toHexString();
});

messageSchema.set('toJSON', {
    virtuals: true
});

exports.Message = mongoose.model('messages', messageSchema)
exports.messageSchema = messageSchema;


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