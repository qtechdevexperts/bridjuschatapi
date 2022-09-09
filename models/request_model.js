const mongoose = require('mongoose')


const requestSchema = new mongoose.Schema({
    sendBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    treeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trees',
        required: true,
    },
    requestType: {
        type: Number,
        required: true,
    }, requestAccept: {
        type: Number,
        required: true,
    },
});



requestSchema.virtual('requestId').get(function () {
    return this._id.toHexString();
});

requestSchema.set('toJSON', {
    virtuals: true
})

exports.Request = mongoose.model('requests', requestSchema)

exports.requestSchema = requestSchema;