const mongoose = require('mongoose')


const treeSchema = new mongoose.Schema({
    treeName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    treePrivacy: {
        type: Boolean,
        required: true
    },
    treeNote: {
        type: String,
        default: ""
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
    relatives: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'relatives',
    },],
    usersInTree: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },],
    media: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'media',
    },]
});



treeSchema.virtual('treeID').get(function () {
    return this._id.toHexString();
});

treeSchema.set('toJSON', {
    virtuals: true
})

exports.Tree = mongoose.model('trees', treeSchema)

exports.treeSchema = treeSchema;