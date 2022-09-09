const { Chat } = require('../models/Chat');
// const {User} = require('../models/User');

const get_messages = async (object, callback) => {
    Chat.find({
        // $or: [
        //     { $and: [{ sender_id: object.sender_id }, { receiver_id: object.receiver_id }] },
        //     { $and: [{ sender_id: object.receiver_id }, { receiver_id: object.sender_id }] },
        // ]
        sender_id: object.sender_id
    }, async (err, results) => {
        if (err) {
            callback(err);
        } else {
            callback(results);
        }
    })
        // .populate({ path: "sender_id", model: "user", select: "user_name , user_image" })
        .populate({ path: "sender_id", model: "relatives", select: "firstName , lastName,image" })
        // .populate({ path: "receiver_id", model: "user", select: "user_name , user_image" })
        .populate({ path: "tree_id", model: "trees", select: "treeName , image" })
}
const send_message = async (object, callback) => {
    console.log("object in message file:", object);
    // var documents_chat = new Chat({ sender_id: object.sender_id, receiver_id: object.receiver_id, message: object.message });
    var documents_chat = new Chat({ sender_id: object.sender_id, tree_id: object.tree_id, message: object.message });
    documents_chat.save(async (err, results) => {
        if (err) {
            callback(err);
        } else {
            Chat.findOne({ _id: results._id }, async (err, results_query) => {
                if (err) {
                    callback(err);
                } else {
                    callback(results_query);
                }
            })
                .populate({ path: "sender_id", model: "relatives", select: "firstName , lastName,image" })
                // .populate({ path: "receiver_id", model: "user", select: "user_name , user_image" })
                .populate({ path: "tree_id", model: "trees", select: "treeName , image" })

        }
    });
}
module.exports = {
    get_messages,
    send_message
}


// const { Chat } = require('../models/Chat');
// // const {User} = require('../models/User');

// const get_messages = async (object, callback) => {
//     Chat.find({
//         $or: [
//             { $and: [{ sender_id: object.sender_id }, { receiver_id: object.receiver_id }] },
//             { $and: [{ sender_id: object.receiver_id }, { receiver_id: object.sender_id }] },
//         ]
//     }, async (err, results) => {
//         if (err) {
//             callback(err);
//         } else {
//             callback(results);
//         }
//     })
//         .populate({ path: "sender_id", model: "user", select: "user_name , user_image" })
//         .populate({ path: "receiver_id", model: "user", select: "user_name , user_image" })
// }
// const send_message = async (object, callback) => {
//     var documents_chat = new Chat({ sender_id: object.sender_id, receiver_id: object.receiver_id, message: object.message });
//     documents_chat.save(async (err, results) => {
//         if (err) {
//             callback(err);
//         } else {
//             Chat.findOne({ _id: results._id }, async (err, results_query) => {
//                 if (err) {
//                     callback(err);
//                 } else {
//                     callback(results_query);
//                 }
//             })
//                 .populate({ path: "sender_id", model: "user", select: "user_name , user_image" })
//                 .populate({ path: "receiver_id", model: "user", select: "user_name , user_image" })
//         }
//     });
// }
// module.exports = {
//     get_messages,
//     send_message
// }


// const { Chat } = require('../models/Chat');
// // const {User} = require('../models/User');

// const get_messages = async(object, callback) => {
//     Chat.find({
//             $or: [
//                 { $and: [{ sender_id: object.sender_id }, { receiver_id: object.receiver_id }] },
//                 { $and: [{ sender_id: object.receiver_id }, { receiver_id: object.sender_id }] },
//             ]
//         }, async(err, results) => {
//             if (err) {
//                 callback(err);
//             } else {
//                 callback(results);
//             }
//         })
//         .populate({ path: "sender_id", model: "user", select: "user_name , user_image" })
//         .populate({ path: "receiver_id", model: "user", select: "user_name , user_image" })
// }
// const send_message = async(object, callback) => {
//     var documents_chat = new Chat({ sender_id: object.sender_id, receiver_id: object.receiver_id, message: object.message });
//     documents_chat.save(async(err, results) => {
//         if (err) {
//             callback(err);
//         } else {
//             Chat.findOne({ _id: results._id }, async(err, results_query) => {
//                     if (err) {
//                         callback(err);
//                     } else {
//                         callback(results_query);
//                     }
//                 })
//                 .populate({ path: "sender_id", model: "user", select: "user_name , user_image" })
//                 .populate({ path: "receiver_id", model: "user", select: "user_name , user_image" })
//         }
//     });
// }
// module.exports = {
//     get_messages,
//     send_message
// }