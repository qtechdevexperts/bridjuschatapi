
const express = require('express')
const { Tree } = require('../models/tree_model')
const { User } = require('../models/user_model')
const { Media } = require('../models/media_model')
const { upload } = require("../config/utils");
var cors = require('cors')

const router = express.Router()
const mongoose = require('mongoose')

const multer = require('multer');


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



router.post('/createTree', upload.single('image'), async (req, res) => {

    try {

        // const file = req.file;
        // if (!file) return res.status(400).send('No image in the request');

        // const fileName = file.filename;
        // const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;


        if (req.file) {
            image = req.file?.path;
        }

        var userintree = [];


        const userExist = await User.findById(req.body.createdBy);
        if (!userExist) return res.status(400).send({ success: false, message: 'UserID   is not correct' })
        userintree.push(req.body.createdBy);

        let createtree = new Tree({
            treeName: req.body.treeName,
            image: req.file
                ? req.file?.path
                : req.body.image,
            treeNote: req.body.treeNote,
            treePrivacy: req.body.treePrivacy,
            createdBy: req.body.createdBy,
            usersInTree: userintree
        });

        createtree = await createtree.save();
        if (!createtree) return res.status(400).send({ success: false, message: 'Issue to create a tree' })



        userExist.userFamilyTrees.push(createtree._id.toHexString())
        const user = await User.findByIdAndUpdate(
            req.body.createdBy,
            {
                userFamilyTrees: userExist.userFamilyTrees,
                $push: {
                    usersInTree: req.body.createdBy
                }

            },

            { new: true }
        )
        if (user) res.status(200).send({ success: true, message: 'Tree Created.!,', data: createtree })


    } catch (e) {
        console.log("errors:", e);
        res.status(400).send(e);
    }

});




// router.post('/createTree', uploadOptions.single('image'), async (req, res) => {

//     try {

//         const file = req.file;
//         if (!file) return res.status(400).send('No image in the request');

//         const fileName = file.filename;
//         const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
//         var userintree = [];


//         const userExist = await User.findById(req.body.createdBy);
//         if (!userExist) return res.status(400).send({ success: false, message: 'UserID   is not correct' })
//         userintree.push(req.body.createdBy);

//         let createtree = new Tree({
//             treeName: req.body.treeName,
//             image: `${basePath}${fileName}`,
//             treeNote: req.body.treeNote,
//             treePrivacy: req.body.treePrivacy,
//             createdBy: req.body.createdBy,
//             usersInTree: userintree
//         });

//         createtree = await createtree.save();
//         if (!createtree) return res.status(400).send({ success: false, message: 'Issue to create a tree' })



//         userExist.userFamilyTrees.push(createtree._id.toHexString())
//         const user = await User.findByIdAndUpdate(
//             req.body.createdBy,
//             {
//                 userFamilyTrees: userExist.userFamilyTrees,
//                 $push: {
//                     usersInTree: req.body.createdBy
//                 }

//             },

//             { new: true }
//         )
//         if (user) res.status(200).send({ success: true, message: 'Tree Created.!,', data: createtree })


//     } catch (e) {
//         console.log("errors:", e);
//         res.status(400).send(e);
//     }





// });



router.get(`/userTree/:id`, async (req, res) => {
    const userTrees = await Tree.find({ createdBy: req.params.id })

        .populate(
            ["createdBy",
                {
                    path: "relatives",
                    populate: {
                        path: "subRelatives",
                        model: 'relatives',
                        populate: {
                            path: "subRelatives",
                            model: 'relatives',
                            populate: {
                                path: "subRelatives",
                                model: 'relatives',
                                populate: {
                                    path: "subRelatives",
                                    model: 'relatives',
                                    populate: {
                                        path: "subRelatives",
                                        model: 'relatives',
                                        populate: {
                                            path: "subRelatives",
                                            model: 'relatives',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },

            ]);

    if (!userTrees) {
        res.status(500).json({ success: false });
    }

    res.send({ success: true, data: userTrees });
});



router.get(`/usersinTree/:id`, async (req, res) => {
    const userTrees = await Tree.find({ usersInTree: req.params.id })

        .populate(
            ["createdBy",
                {
                    path: "relatives",
                    populate: {
                        path: "subRelatives",
                        model: 'relatives',
                        populate: {
                            path: "subRelatives",
                            model: 'relatives',
                            populate: {
                                path: "subRelatives",
                                model: 'relatives',
                                populate: {
                                    path: "subRelatives",
                                    model: 'relatives',
                                    populate: {
                                        path: "subRelatives",
                                        model: 'relatives',
                                        populate: {
                                            path: "subRelatives",
                                            model: 'relatives',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            ]);

    if (!userTrees) {
        res.status(500).json({ success: false });
    }

    res.send({ success: true, data: userTrees });
});



router.get(`/treeDetails/:id`, async (req, res) => {
    console.log(req.params.id)
    const tree = await Tree.find({ _id: req.params.id })
        .populate(
            ["createdBy",
                {
                    path: "relatives",
                    populate: {
                        path: "subRelatives",
                        model: 'relatives',
                        populate: {
                            path: "subRelatives",
                            model: 'relatives',
                            populate: {
                                path: "subRelatives",
                                model: 'relatives',
                                populate: {
                                    path: "subRelatives",
                                    model: 'relatives',
                                    populate: {
                                        path: "subRelatives",
                                        model: 'relatives',
                                        populate: {
                                            path: "subRelatives",
                                            model: 'relatives',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    path: "media",
                    populate: "media",
                }

            ]);
    // .populate(
    //     ["createdBy",
    //         {
    //             path: "relatives",
    //             populate: {
    //                 path: "subRelatives",
    //                 populate: "subRelatives",
    //             },
    //         }

    //     ]);

    if (!tree) {
        res.status(500).json({ success: false });
    }
    // console.log(tree[0].relatives.filter(e => e.parentRelative));
    tree[0].relatives = tree[0].relatives.filter(e => e.parentRelative == null);
    res.send({ success: true, data: tree[0] });
});






router.get(`/maleusers`, async (req, res) => {
    const userTrees = await User.find({ userGender: "Male" })

    if (!userTrees) {
        res.status(500).json({ success: false });
    }

    res.send({ success: true, data: userTrees });
});



router.get(`/femaleusers`, async (req, res) => {
    const userTrees = await User.find({ userGender: "Female" })

    if (!userTrees) {
        res.status(500).json({ success: false });
    }

    res.send({ success: true, data: userTrees });
});






router.get(`/TreeByuserId/:id`, cors(), async (req, res) => {
    const userTrees = await Tree.find({ createdBy: req.params.id })

        .populate("relatives")

    if (!userTrees) {
        res.status(500).json({ success: false });
    }

    res.send({ success: true, data: userTrees });
});



router.get(`/getTreeDetailsByTreeId/:id`, cors(), async (req, res) => {
    const userTrees = await Tree.find({ _id: req.params.id }).populate("createdBy").populate("relatives")

    if (!userTrees) {
        res.status(500).json({ success: false });
    }

    res.send({ success: true, data: userTrees });
});




router.get(`/allPublicTrees`, async (req, res) => {
    const userTrees = await Tree.find({ treePrivacy: true })

    if (!userTrees) {
        res.status(500).json({ success: false });
    }

    res.send({ success: true, data: userTrees });
});


router.get(`/allTrees`, async (req, res) => {
    const userTrees = await Tree.find({})

    if (!userTrees) {
        res.status(500).json({ success: false });
    }

    res.send({ success: true, data: userTrees });
});



router.get(`/getMyPrivateAndAllPublicTress/:id`, async (req, res) => {
    // const userTrees = await Tree.find({ relatives: req.params.id }, { treePrivacy: false }, { new: true }).populate("relatives")
    // const privateTrees = await (await Tree.find({ relatives: req.params.id, treePrivacy: false }))
    // const publicTrees = await (await Tree.find({ treePrivacy: true }))
    const privateTrees = await (await Tree.find({ createdBy: req.params.id, treePrivacy: false }))
    const publicTrees = await (await Tree.find({ treePrivacy: true }))
    const data = [...privateTrees, ...publicTrees]
    if (!privateTrees || !publicTrees) {
        res.status(500).json({ success: false });
    }


    function sortFunction(a, b) {
        var dateA = new Date(a.createDate).getTime();
        var dateB = new Date(b.createDate).getTime();
        return dateA > dateB ? 1 : -1;
    };

    let data2 = data.sort(sortFunction);


    // res.send({ success: true, privateTrees: privateTrees, publicTrees: publicTrees });
    // res.send({ success: true, data: { privateTrees, publicTrees } });
    // res.send({ success: true, data: privateTrees });
    res.send({ success: true, data: data.reverse() });
    // res.send({ success: true, data: data2 });
});


router.get(`/getMyPrivateAndPublicTress/:id`, async (req, res) => {
    const myTrees = await (await Tree.find({ createdBy: req.params.id }))
    if (!myTrees) {
        res.status(500).json({ success: false });
    }
    res.send({ success: true, data: myTrees });
});




router.get(`/getvideosInTree/:id`, async (req, res) => {
    try {
        const myTrees = await (await Tree.find({ _id: req.params.id }))
        let myMedia = ""
        for (let i = 0; i < myTrees.length; i++) {
            myMedia = myTrees[i].media;
        }
        // console.log("myMedia:", myMedia);
        let allCards = []
        for (let i = 0; i < myMedia.length; i++) {
            let get_post = await Media.find({ _id: myMedia[i], type: "video" })
            if (get_post.length) { allCards.push(get_post[0]) }
        }
        if (!allCards) {
            res.status(500).json({ success: false });
        }
        res.send({ success: true, data: allCards });
        // if (!myTrees) {
        //     res.status(500).json({ success: false });
        // }
        // res.send({ success: true, data: myTrees });
    } catch (error) {
        console.log("error:", error);
    }
});




router.get(`/getimagesInTree/:id`, async (req, res) => {
    try {
        const myTrees = await (await Tree.find({ _id: req.params.id }))
        let myMedia = ""
        for (let i = 0; i < myTrees.length; i++) {
            myMedia = myTrees[i].media;
        }
        // console.log("myMedia:", myMedia);
        let allCards = []
        for (let i = 0; i < myMedia.length; i++) {
            let get_post = await Media.find({ _id: myMedia[i], type: "image" })
            if (get_post.length) { allCards.push(get_post[0]) }
        }
        if (!allCards) {
            res.status(500).json({ success: false });
        }
        res.send({ success: true, data: allCards });
        // if (!myTrees) {
        //     res.status(500).json({ success: false });
        // }
        // res.send({ success: true, data: myTrees });
    } catch (error) {
        console.log("error:", error);
    }
});




module.exports = router


