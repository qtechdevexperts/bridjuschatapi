
const express = require('express')
const { Tree } = require('../models/tree_model')
const { User } = require('../models/user_model')
const { Relatives } = require('../models/relative_model')
const { Media } = require('../models/media_model');
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer');
const { upload } = require("../config/utils");

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'video/mp3': 'mp3',
    'video/mp4': 'mp4',
    'video/mov': 'mov',
};


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file.mimetype);
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'uploads/public');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});
const uploadOptions = multer({ storage: storage });


// router.post('/addMediatoTree/:id', uploadOptions.single('media'), async (req, res) => {
router.post('/addMediatoTree/:id', upload.single('image'), async (req, res) => {

    try {
        // const file = req.file;
        // if (!file) return res.status(400).send('No image in the request');
        if (req.file) {
            image = req.file?.path;
        }
        const treeExist = await Tree.findById(req.params.id);
        if (!treeExist) return res.status(400).send({ success: false, message: 'TreeID is not correct' })

        // const fileName = file.filename;
        // const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        // console.log(fileName); console.log(basePath);
        // console.log(req.body);
        let createMedia = new Media({
            type: req.body.type,
            // lastName: req.body.lastName,
            // media: `${basePath}${fileName}`,
            image: req.file
                ? req.file?.path
                : req.body.image
        });


        createMedia = await createMedia.save();
        if (!createMedia)
            return res.status(400).send({ success: false, message: 'Something Went Wrong.!,' })
        console.log(createMedia._id.toString());
        var addid = createMedia._id.toHexString();

        const tree = await Tree.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    media: addid
                }
            },
            { new: true }
        )
        console.log(tree);

        res.status(200).send({ success: true, data: createMedia, message: 'Uploaded' })


        // treeExist.relatives.push(createRelative._id.toHexString())

        // const tree = await Tree.findByIdAndUpdate(
        //     req.body.treeID,
        //     {
        //         relatives: treeExist.relatives
        //     },
        //     { new: true }
        // )

        // if (req.body.parentRelative) {
        //     console.log(req.body.parentRelative)

        //     const parent = await Relatives.findById(
        //         req.body.parentRelative
        //     );
        //     // console.log(parent)
        //     // console.log(parent)

        //     parent.subRelatives.push(createRelative)
        //     const user = await Relatives.findByIdAndUpdate(
        //         req.body.parentRelative,
        //         {
        //             subRelatives: parent.subRelatives,
        //         },
        //         { new: true }
        //     )
        //     // console.log(user)
        //     if (!user) return res.status(400).send({ success: false, message: 'Something Went Wrong.!,' })

        //     // res.send(ser);
        // }


        // res.status(200).send({ success: true, message: 'Relative Created Created.!,', data: createRelative })

    } catch (error) {
        console.log("error:", error);
    }

});


// router.get(`/getSingleUser/:id`, async (req, res) => {
//     const user = await User.find({ _id: req.params.id })

//         ;

//     if (!user) {
//         res.status(500).json({ success: false, message: 'Something went wrong' });
//     }

//     res.send({ success: true, data: user });
// });


module.exports = router


