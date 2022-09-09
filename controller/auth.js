const express = require('express');
const { User } = require('../models/user_model');
const router = express.Router()
const { upload } = require("../config/utils");


//Register Api
router.post('/register', async (req, res) => {
    console.log(req.body);
    let user = new User({
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userPassword: req.body.userPassword,
        userFamilyTrees: req.body.userFamilyTrees,
        userDOB: req.body.userDOB,
        userAbout: req.body.userAbout,
        userGender: req.body.userGender,
        image: req.body.image,

    })

    try {

        checkUser = await User.findOne({ userEmail: req.body.userEmail }).exec()

        if (checkUser)
            return res.status(400).send({ success: false, message: 'Email already exist' })


        else user = await user.save()

        if (!user) {
            return res.status(400).send({ success: false, message: 'Something went wrong' })
        }
        res.status(200).send({ success: true, data: user });
    } catch (error) {

    }


});



//Login Api
router.post('/login', async (req, res) => {
    let user = new User({
        userEmail: req.body.userEmail,
        userPassword: req.body.userPassword,
    })

    try {

        checkUser = await User.findOne({ userEmail: req.body.userEmail }).exec()

        if (checkUser && req.body.userPassword == checkUser.userPassword)
            return res.status(200).send({ success: true, data: checkUser })
        else res.status(400).send({ success: false, message: 'Email or Password is wrong' })

    } catch (error) {

    }


});


router.post('/loginSocial', async (req, res) => {

    checkUser = await User.findOne({ userEmail: req.body.userEmail }).exec()

    if (!checkUser) {
        let user = new User({
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userPassword: 'social',
            userFamilyTrees: [],
            userDOB: req.body.userDOB,
            userAbout: req.body.userAbout,
            userGender: req.body.userGender,
            image: req.body.image,

        })

        user = await user.save()
        if (!user) {
            return res.status(400).send({ success: false, message: 'Something went wrong' })
        }
        return res.status(200).send({ success: true, message: 'Login Success', data: user })
    }

    return res.status(200).send({ success: true, message: 'Login Success', data: checkUser })

});



//change_password Api
router.post('/change_password', async (req, res) => {

    try {
        const userFind = await User.findOne({ userEmail: req.body.userEmail });

        console.log('userFind', userFind);

        if (userFind) {
            const updateUser = await User.findOneAndUpdate({ _id: userFind._id }, {
                userPassword: req.body.newPassword,
                // user_verification_code: null
            });
            res.status(200).send({ status: 200, message: 'Your password has been change successfully' });
        }
        else {
            res.status(400).send({ status: 0, message: 'Failed password  change' });

        }

    } catch (e) {
        res.status(400).send({ status: 0, message: "Failed password  change" });
    }

});



//update profile Api
router.post('/update_profile', upload.single('image'), async (req, res) => {

    try {

        if (req.file) {
            image = req.file.path
        }
        const object_update = {

            image: (req.file ? req.file.path : req.body.image),
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userDOB: req.body.userDOB,
            userGender: req.body.userGender,
            userAbout: req.body.userAbout,


        }

        for (const key in object_update) {
            if (
                object_update[key] === "" ||
                object_update[key] === undefined
            ) {
                delete object_update[key];
            }
        }
        // console.log(object_update);

        const updateUser = await User.findOneAndUpdate({ _id: req.body.user_id }, object_update, { new: true });

        // const updateUser = await User.save();

        if (updateUser) {
            // console.log("updateUser:", updateUser);
            res.status(200).send({ success: true, message: 'Profile Update Successfully.', data: updateUser });

        } else {
            res.status(400).send({ success: false, message: 'Something Went Wrong.' });
        }

    } catch (e) {
        console.log("e:", e);
        res.status(400).send({ success: false, message: "Failed Profile Update" });
    }






});



//notification on off
router.post('/notification', async (req, res) => {

    try {
        if (req.body.notification == "off") {


            let user = await User.findOneAndUpdate(
                { _id: req.body.user_id },
                {
                    notification: "off",
                    is_notification: 0
                },
                { new: true }
            );


            res
                .status(200)
                .send({ status: 200, message: "Notification Off", data: user });

        } else if (req.body.notification == "on") {
            let user = await User.findOneAndUpdate(
                { _id: req.body.user_id },
                {
                    notification: "on",
                    is_notification: 1
                },
                { new: true }
            );
            res
                .status(200)
                .send({ status: 0, message: "Notification ON", data: user });
        }
    } catch (e) {
        res.status(400).send({ status: 0, message: "Failed Notification toggle!" });
    }


});





module.exports = router



