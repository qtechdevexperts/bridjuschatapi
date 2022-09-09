
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname == "image") {
      cb(null, "./uploads/images/");
    }
    // if (file.fieldname == "myMediaFile") {
    //   cb(null, "./uploads/videos/");
    // }
    if (file.fieldname == "feedpost_images") {
      cb(null, "./uploads/feedPostImages/");
    }
    if (file.fieldname == "event_image") {
      cb(null, "./uploads/eventPostImages/");
    }
    if (file.fieldname == "category_image") {
      cb(null, "./uploads/category/");
    }
    if (file.fieldname == "hf_images[]") {
      cb(null, "./uploads/feedback/");
    }
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

function fileFilter(req, file, cb) {
  cb(null, true);
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf" ||
    // file.mimetype === "myMediaFile/mp3" ||
    // file.mimetype === "myMediaFile/mp4" ||
    // file.mimetype === "myMediaFile/mov" ||
    file.mimetype === "image/mp3" ||
    file.mimetype === "image/mp4" ||
    file.mimetype === "image/mov"
    // file.mimetype === "myMediaFile/jpeg" ||
    // file.mimetype === "myMediaFile/jpg" ||
    // file.mimetype === "myMediaFile/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});


module.exports = { upload };



