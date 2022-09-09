const express = require('express')
var cors = require('cors')

const { Message } = require('../models/message_model')
const { User } = require('../models/user_model')
const { Chat } = require('../models/Chat')

const router = express.Router()
const mongoose = require('mongoose')

router.post('/sendMessage', async (req, res) => {
    let message = new Message({
        message: req.body.message,
        username: req.body.username,
        treeId: req.body.treeId,
        createdBy: req.body.createdBy,
    });
    const userExist = await User.findById(req.body.createdBy);
    if (!userExist) return res.status(400).send({ success: false, message: 'UserID   is not correct' })
    const treeExist = await User.findById(req.body.treeId);
    if (!userExist) return res.status(400).send({ success: false, message: 'TreeId   is not correct' })

    message = await message.save();
    if (!message) return res.status(400).send({ success: false, message: 'Issue to create a tree' })

    res.status(200).send({ success: true, message: 'Message Sended,', data: message })
});


router.get(`/getMessageByTree/:id`, cors(), async (req, res) => {
    const message = await Message.find({ treeId: req.params.id })
        .populate(
            ["createdBy"
            ]);


    if (!message) {
        res.status(500).json({ success: false });
    }
    // console.log(tree[0].relatives.filter(e => e.parentRelative));
    res.send({ success: true, data: message });
});


///////  api for get chat /////

router.get(`/chat/:tree_id`, async (req, res) => {

    try {
        const chats = await (await Chat.find({ tree_id: req.params.tree_id }).populate('sender_id', { _id: 1, firstName: 1, lastName: 1, image: 1 })).reverse()
        // console.log("chats:", chats);
        if (chats) {
            res.status(200).send({
                status: 1,
                message: " you have find list of Chats Successfully.",
                data: chats,
            });
        } else {
            res.status(400).send({
                status: 0,
                message: " Failed list of Chats.",
                chats: [],
            });
        }

    } catch (e) {
        console.log("errors:", e);
        res.status(400).send(e);
    }

});



module.exports = router

















// const express = require('express')

// const { Message } = require('../models/message_model')
// const { User } = require('../models/user_model')

// const router = express.Router()
// const mongoose = require('mongoose')

// router.post('/sendMessage', async (req, res) => {
//     let message = new Message({
//         message: req.body.message,
//         username: req.body.username,
//         treeId: req.body.treeId,
//         createdBy: req.body.createdBy,
//     });
//     const userExist = await User.findById(req.body.createdBy);
//     if (!userExist) return res.status(400).send({ success: false, message: 'UserID   is not correct' })
//     const treeExist = await User.findById(req.body.treeId);
//     if (!userExist) return res.status(400).send({ success: false, message: 'TreeId   is not correct' })

//     message = await message.save();
//     if (!message) return res.status(400).send({ success: false, message: 'Issue to create a tree' })

//     res.status(200).send({ success: true, message: 'Message Sended,', data: message })
// });

// router.get(`/   /:id`, async (req, res) => {
//     const message = await Message.find({ treeID: req.params.id })
//         .populate(
//             ["createdBy"
//             ]);


//     if (!message) {
//         res.status(500).json({ success: false });
//     }
//     // console.log(tree[0].relatives.filter(e => e.parentRelative));
//     res.send({ success: true, data: message });
// });


// module.exports = router


