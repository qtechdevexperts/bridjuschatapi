const mongoose = require('mongoose')

const relativeSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    }, image: {
        type: String,
    },
    relativeEmail: {
        type: String,
    },
    relativeType: {
        type: Number,
        required: false
    },
    // relative grandfather0, father1, mother2, wife3, sister4, brother5, child6
    treeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trees',
        required: true,
    },
    subRelatives: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'relatives',
        required: false
    }],
    parentRelative: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'relatives',
        required: false
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'relatives',
        required: false
    },
    mid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'relatives',
        required: false,
        default: null
    },
    fid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'relatives',
        required: false,
        default: null
    },
    pids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "relatives",
        required: false,
        default: null
    }],
    Gender: {
        type: String,
        required: false
    },

});

relativeSchema.virtual('relativeId').get(function () {
    return this._id.toHexString();
});

relativeSchema.set('toJSON', {
    virtuals: true
})

exports.Relatives = mongoose.model('relatives', relativeSchema)

exports.relativeSchema = relativeSchema;