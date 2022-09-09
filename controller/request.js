
const express = require('express')
const { Request } = require('../models/request_model')
const { User } = require('../models/user_model')
const { RelativeTree } = require('../models/user_model')
const { Tree } = require('../models/tree_model')

const router = express.Router()
const mongoose = require('mongoose')


router.post('/sendRequest', async (req, res) => {
    console.log(req.body.userEmail);
    console.log(req.body.sendBy);

    checkUser = await User.findOne({ userEmail: req.body.userEmail }).exec()

    if (!checkUser)
        return res.status(400).send({ success: false, message: 'Email not exist in app.' })
    console.log(checkUser._id);

    let sendRequest = Request({
        sendBy: req.body.sendBy,
        to: checkUser._id.toHexString(),
        treeId: req.body.treeId,
        requestType: req.body.requestType,
        requestAccept: req.body.requestAccept,

    });


    sendRequest = await sendRequest.save();


    if (!sendRequest) return res.status(200).send({ success: false, message: 'something went wrong,' })

    res.status(200).send({ success: true, message: 'Request Sended.!,', data: sendRequest })
});


router.post('/acceptTreeRequest/:id', async (req, res) => {
    // console.log(req.body.treeId);
    console.log(req.params.id);

    checkRequest = await Request.findOne({ _id: req.params.id }).exec()

    if (!checkRequest)
        return res.status(400).send({ success: false, message: 'Something went wrong' })

    console.log(checkRequest);

    const accept = await Request.findByIdAndUpdate(
        req.params.id,
        {
            requestAccept: 1,
        },

        { new: true }
    );

    const addinTree = await Tree.findByIdAndUpdate(
        checkRequest.treeId,
        {
            $push: {
                usersInTree: checkRequest.to
            }

        },

        { new: true }
    );

    // let sendRequest = Request({
    //     sendBy: req.body.sendBy,
    //     to: checkUser._id.toHexString(),
    //     treeId: req.body.treeId,
    //     requestType: req.body.requestType,
    //     requestAccept: req.body.requestAccept,

    // });


    // sendRequest = await sendRequest.save();


    if (!addinTree) return res.status(200).send({ success: false, message: 'something went wrong,' })

    res.status(200).send({ success: true, message: 'Accepted.!,', data: addinTree })
});

router.get(`/getRequestbyuser/:id`, async (req, res) => {
    const getrequest = await Request.find({ to: req.params.id })

        .populate(
            ["sendBy", "to", "treeId"]);

    if (!getrequest) {
        res.status(500).json({ success: false, 'message': 'something went wrong' });
    }

    res.send({ success: true, data: getrequest });
});

module.exports = router
