
const express = require('express')
const { Tree } = require('../models/tree_model')
const { User } = require('../models/user_model')
const { Relatives } = require('../models/relative_model')

const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer');
const { upload } = require("../config/utils");

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
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



router.post('/addRelative', upload.single('image'), async (req, res) => {


    try {


        if (req.file) {
            image = req.file?.path;
        }

        let createRelative = new Relatives({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            relativeEmail: req.body.relativeEmail,
            relativeType: req.body.relativeType,
            treeID: req.body.treeID,
            subRelatives: req.body.subRelatives,
            parentRelative: req.body.parentRelative,
            image: req.file
                ? req.file?.path
                : req.body.image,
            mid: req.body.mid,
            fid: req.body.fid,
            pids: req.body.pids,
            Gender: req.body.Gender,

        });
        const treeExist = await Tree.findById(req.body.treeID);
        if (!treeExist) return res.status(400).send({ success: false, message: 'TreeID is not correct' })
        createRelative = await createRelative.save();
        if (!createRelative)
            return res.status(400).send({ success: false, message: 'Something Went Wrong.!,' })
        treeExist.relatives.push(createRelative._id.toHexString())

        const tree = await Tree.findByIdAndUpdate(
            { _id: req.body.treeID },
            {
                relatives: treeExist.relatives
            },
            { new: true }
        )

        if (req.body.parentRelative) {
            console.log(req.body.parentRelative)

            const parent = await Relatives.findById(
                { parentRelative: req.body.parentRelative }
            );
            // console.log(parent)
            // console.log(parent)

            parent.subRelatives.push(createRelative)
            const user = await Relatives.findByIdAndUpdate(
                { parentRelative: req.body.parentRelative },
                {
                    subRelatives: parent.subRelatives,
                },
                { new: true }
            )
            // console.log(user)
            if (!user) return res.status(400).send({ success: false, message: 'Something Went Wrong.!,' })

            // res.send(ser);
        }


        return res.status(200).send({ success: true, message: 'Relative Created Created.!,', data: createRelative })


    } catch (e) {
        return res
            .status(400)
            .send({ status: 0, message: "Failed To Add Relative" });
    }


});




// router.post('/addRelative', uploadOptions.single('image'), async (req, res) => {


//     try {

//         const file = req.file;
//         if (!file) return res.status(400).send('No image in the request');

//         const fileName = file.filename;
//         const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
//         console.log(fileName); console.log(basePath);
//         console.log(req.body);
//         let createRelative = new Relatives({
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             relativeEmail: req.body.relativeEmail,
//             relativeType: req.body.relativeType,
//             treeID: req.body.treeID,
//             subRelatives: req.body.subRelatives,
//             parentRelative: req.body.parentRelative,
//             image: `${basePath}${fileName}`,
//             mid: req.body.mid,
//             fid: req.body.fid,
//             pids: req.body.pids,
//             Gender: req.body.Gender,

//         });
//         const treeExist = await Tree.findById(req.body.treeID);
//         if (!treeExist) return res.status(400).send({ success: false, message: 'TreeID is not correct' })
//         createRelative = await createRelative.save();
//         if (!createRelative)
//             return res.status(400).send({ success: false, message: 'Something Went Wrong.!,' })
//         treeExist.relatives.push(createRelative._id.toHexString())

//         const tree = await Tree.findByIdAndUpdate(
//             { _id: req.body.treeID },
//             {
//                 relatives: treeExist.relatives
//             },
//             { new: true }
//         )

//         if (req.body.parentRelative) {
//             console.log(req.body.parentRelative)

//             const parent = await Relatives.findById(
//                 { parentRelative: req.body.parentRelative }
//             );
//             // console.log(parent)
//             // console.log(parent)

//             parent.subRelatives.push(createRelative)
//             const user = await Relatives.findByIdAndUpdate(
//                 { parentRelative: req.body.parentRelative },
//                 {
//                     subRelatives: parent.subRelatives,
//                 },
//                 { new: true }
//             )
//             // console.log(user)
//             if (!user) return res.status(400).send({ success: false, message: 'Something Went Wrong.!,' })

//             // res.send(ser);
//         }


//         return res.status(200).send({ success: true, message: 'Relative Created Created.!,', data: createRelative })


//     } catch (e) {
//         return res
//             .status(400)
//             .send({ status: 0, message: "Failed To Add Relative" });
//     }


// });


router.get(`/getSingleUser/:id`, async (req, res) => {
    const user = await User.find({ _id: req.params.id })

        ;

    if (!user) {
        return res.status(500).json({ success: false, message: 'Something went wrong' });
    }

    return res.send({ success: true, data: user });
});




router.get(`/maleusersInRelative`, async (req, res) => {
    const userTrees = await Relatives.find({ Gender: "Male" })

    if (!userTrees) {
        res.status(500).json({ success: false });
    }

    res.send({ success: true, data: userTrees });
});



router.get(`/femaleusersInRelative`, async (req, res) => {
    const userTrees = await Relatives.find({ Gender: "Female" })

    if (!userTrees) {
        res.status(500).json({ success: false });
    }

    res.send({ success: true, data: userTrees });
});



router.get(`/femaleusersInRelative/:treeId`, async (req, res) => {
    const userTrees = await Relatives.find({ treeID: req.params.treeId, Gender: "Female" })

    if (!userTrees) {
        res.status(500).json({ success: false });
    }

    res.send({ success: true, data: userTrees });
});


router.get(`/maleusersInRelative/:treeId`, async (req, res) => {
    const userTrees = await Relatives.find({ treeID: req.params.treeId, Gender: "Male" })

    if (!userTrees) {
        res.status(500).json({ success: false });
    }

    res.send({ success: true, data: userTrees });
});



router.get(`/allUsersInRelative/:treeId`, async (req, res) => {
    const userTrees = await Relatives.find({ treeID: req.params.treeId })

    if (!userTrees) {
        res.status(500).json({ success: false });
    }

    res.send({ success: true, data: userTrees });
});



router.post(`/updateRelativePids`, async (req, res) => {

    try {

        const Relative = await Relatives.findOneAndUpdate({ _id: req.body.relativeId },
            {
                $push: { pids: req.body.pId },
            },
            { new: true }
        )
        if (!Relative) {
            res.status(500).json({ success: false });
        }
        res.send({ success: true, data: Relative });

    } catch (e) {
        return res
            .status(400)
            .send({ status: 0, message: e.message });
    }






});





module.exports = router


