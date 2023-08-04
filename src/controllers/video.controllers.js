const fs = require("fs");
var path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = "C:\\ffmpeg\\ffmpeg\\bin\\ffmpeg.exe";
ffmpeg.setFfmpegPath(ffmpegPath);
const videoRepo = require("../models/videoRepo");
const { sequelize } = require("../../database/models");
const CommentModel = require("../models/Comment.model");
const favouriteModel = require("../models/favourite.model");
const videoDirectory = "../../uploads/videos/videos_temp/";

//delete files that don't exist
const deleteFile = (filePath) => {
  if (filePath) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("erro delete file:", err);
      }
    });
  }
};

const moveFile = (sourcePath, destinationPath, newSourcePath) => {
  console.log(sourcePath, destinationPath, newSourcePath);
  // Create a destination directory if it doesn't already exist
  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true });
  }
  //move file
  fs.rename(sourcePath, newSourcePath, (err) => {
    if (err) {
      deleteFile(sourcePath);
      return console.log("lỗi", err);
    }
  });
};

exports.create = async (req, res) => {
  try {
    const filePath = req.file.path;
    const id = req.user.id;
    const { videotag, videotitle, videodescrible } = req.body;
    const newData = {
      userid: id,
      videotag,
      videotitle,
      videodescrible,
      videouri: req.file.filename,
    };

    if (!filePath) {
      return res.status(400).json({ status: 400, msg: "please chosse file" });
    }
    //If successful, move the file to the new folder
    const sourcePath = filePath;
    const destinationDirectory = "uploads/videos/" + id;
    // Create a destination directory if it doesn't already exist
    if (!fs.existsSync(destinationDirectory)) {
      fs.mkdirSync(destinationDirectory, { recursive: true });
    }
    const destinationPath = path.join(
      destinationDirectory,
      path.basename(sourcePath)
    );

    console.log(sourcePath, destinationPath);
    // const inputVideoPath =
    //   "uploads\\videos\\videos_temp\\filek1689846418985g795609787.mp4";
    // const outputVideoPath =
    //   "uploads\\videos\\10\\filek1689776228027g363996930a.mp4";

    ffmpeg(sourcePath)
      .output(destinationPath)
      .videoCodec("libx264")
      .size("720x480") // Kích thước 480p
      .outputOptions("-crf 28") // Chất lượng video (CRF) - giá trị từ 0 (tốt nhất) đến 51 (xấu nhất), giới thiệu ở mức khoảng 18-28 cho chất lượng thông thường
      .on("end", () => {
        console.log("Video conversion finished");
        deleteFile(sourcePath);
      })
      .on("error", (err) => {
        console.error("Video conversion error:", err);
      })
      .run();

    const result = await videoRepo.create(newData);
    if (!result) {
      return res.status(400).json({ status: 400, msg: "insert video fail" });
    }
    return res.status(201).json({ status: 201, msg: "ok" });
  } catch (error) {
    return res.status(400).json({ status: 400, msg: "insert video fail" });
  }
};

exports.all = async (req, res) => {
  const myid = req.query.myid;

  const _page = req.query.page;
  const _perPage = 5;
  let offset = (_page - 1) * _perPage;
  let limit = _perPage;
  const result = await videoRepo.getAll(limit, offset, myid ? myid : -1);
  res.status(200).json({
    status: 200,
    data: result,
  });
};

exports.getVideoSingle = (req, res) => {
  const videoUrl = req.query.video;
  if (videoUrl) {
    const rootDirectory = path.dirname(require.main.filename);
    console.log(rootDirectory);
    const videoPath = path.join(rootDirectory + "/uploads/videos/", videoUrl);
    res.sendFile(videoPath);
  } else {
    res.status(400).send("Missing videoUrl parameter");
  }
};
exports.delete = async (req, res) => {
  try {
    const video_id = req.body.video_id;
    const dataVideo = await videoRepo.getById(video_id);

    if (!dataVideo)
      return res.status(404).json({
        status: 404,
        msg: "id does not exist",
      });

    const { userid, videouri } = dataVideo.dataValues;
    //deleteFile(`uploads/videos/${userid}/${videouri}`);

    await sequelize.transaction(async (transaction) => {
      await favouriteModel.deleteFavourite(video_id, transaction);
      await CommentModel.deleteComment(video_id, transaction);
      await videoRepo.delete(video_id, transaction);
    });

    moveFile(
      `uploads/videos/${userid}/${videouri}`,
      `uploads/video_delete/${userid}`,
      `uploads/video_delete/${userid}/${videouri}`
    );

    //  await videoRepo.delete(video_id);

    res.status(200).json({
      status: 200,
      data: "ok",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 400,
      msg: "delele video fail!",
    });
  }
};
exports.allUser = async (req, res) => {
  const myid = req.query.myid;

  const _page = req.query.page;
  const _perPage = 10;
  let offset = (_page - 1) * _perPage;
  let limit = _perPage;
  const { count, rows } = await videoRepo.getUserId(
    limit,
    offset,
    myid ? myid : -1
  );
  res.status(200).json({
    status: 200,
    total: count,
    data: rows,
  });
};
exports.update = async (req, res) => {
  try {
    const myid = req.user.id;
    const { videodescrible, videotitle, videotag, videoid } = req.body;
    let newData = {
      videodescrible,
      videotitle,
      videotag,
    };
    console.log("--->", newData);
    const resultVideo = await videoRepo.checkVideoUpdate(videoid, myid);

    if (!resultVideo) {
      return res.status(404).json({
        status: 404,
        msg: "video does not exit!",
      });
    }

    const resultUpdate = await videoRepo.update(newData, videoid);

    if (resultUpdate == 0) {
      return res.status(400).json({
        status: 400,
        msg: "update video fail!",
      });
    }

    return res.status(200).json({
      status: 200,
      data: "ok",
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      msg: "update video fail!",
    });
  }
};
// exports.delete = async (req, res) => {
//   try {
//     const myid = req.user.id;
//     const { videoid } = req.body;
//     const resultVideo = await videoRepo.checkVideoUpdate(videoid, myid);
//     if (!resultVideo) {
//       return res.status(404).json({
//         status: 404,
//         msg: "video does not exit!",
//       });
//     }
//   } catch (error) {
//     res.status(400).json({
//       status: 400,
//       msg: "delete video fail!",
//     });
//   }
// };
