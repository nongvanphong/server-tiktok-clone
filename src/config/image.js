const multer = require("multer");

const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = "./uploads/images/images_temp";

    createFolder(folder);
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});
// create a new folder if the item doesn't exist
function createFolder(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

var uploadImage = multer({ storage: storage });
module.exports = uploadImage.single("uploadImage");
