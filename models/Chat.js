const mongoose = require('mongoose');

const chatScheme = new mongoose.Schema({
    // sender_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "user",
    //     require: true
    // },
    // receiver_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "user",
    //     require: true
    // },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "relatives",
        require: false
    },
    tree_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "trees",
        require: false
    },
    message: {
        type: String,
        require: false
    },
    group_id: {
        type: String,
        require: false
    },
    is_read: {
        type: String,
        enum: ['0', '1'],
        default: '0'
    },
    is_blocked: {
        type: String,
        enum: ['0', '1'],
        default: '0'
    },
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatScheme);
module.exports = { Chat };