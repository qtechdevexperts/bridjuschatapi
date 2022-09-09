const mongoose = require('mongoose')

const mediaSchema = new mongoose.Schema({
    type: {
        type: String,
        required: false,
    },
    // media: {
    //     type: String,
    //     required: false,
    // },
    image: {
        type: String,
        required: false,
    },

});

mediaSchema.virtual('mediaID').get(function () {
    return this._id.toHexString();
});

mediaSchema.set('toJSON', {
    virtuals: true
});

exports.Media = mongoose.model('media', mediaSchema)
exports.mediaSchema = mediaSchema;


