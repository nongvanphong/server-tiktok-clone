const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = "./uploads/videos/videos_temp";
    createFolder(folder);
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "g" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "k" + uniqueSuffix + ".mp4");
  },
});
// create a new folder if the item doesn't exist
function createFolder(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

var uploadvideo = multer({ storage: storage });
module.exports = uploadvideo.single("file");
