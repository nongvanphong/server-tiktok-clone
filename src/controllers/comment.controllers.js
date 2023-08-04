const CommentModel = require("../models/Comment.model");
const videoRepo = require("../models/videoRepo");

exports.create = async (req, res) => {
  try {
    const userid = req.user.id;
    const { messenger, videoid } = req.body;
    const newData = {
      userid,
      messenger,
      videoid,
    };

    const dataVideo = await videoRepo.getById(videoid);
    if (!dataVideo) {
      return res.status(404).json({
        status: 404,
        msg: "not found video",
      });
    }

    const result = await CommentModel.create(newData);
    if (result == 0) {
      return res.status(400).json({
        status: 400,
        msg: "insert comment fail",
      });
    }

    return res.status(200).json({
      status: 200,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      msg: "insert comment fail",
    });
  }
};
exports.getAll = async (req, res) => {
  try {
    const { idVideo } = req.query;
    const { count, rows } = await CommentModel.getByIdVideo(idVideo);

    return res.status(200).json({
      status: 200,
      total: count,
      data: rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: 400,
      msg: "get comment fail",
    });
  }
};
exports.update = async (req, res) => {
  try {
    const userid = req.user.id;
    const { comment_id, messenger, videoid } = req.body;

    const dataVideo = await CommentModel.checkComment(
      userid,
      videoid,
      comment_id
    );

    if (!dataVideo[0]) {
      return res.status(404).json({
        status: 404,
        msg: "not found video",
      });
    }

    const result = await CommentModel.update(comment_id, messenger);
    if (result == 0) {
      return res.status(400).json({
        status: 400,
        msg: "update comment fail",
      });
    }

    return res.status(200).json({
      status: 200,
      data: "ok",
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      msg: "update comment fail",
    });
  }
};
exports.delete = async (req, res) => {
  try {
    const userid = req.user.id;
    const { comment_id, videoid } = req.body;

    const dataVideo = await CommentModel.checkComment(
      userid,
      videoid,
      comment_id
    );

    if (!dataVideo[0]) {
      return res.status(404).json({
        status: 404,
        msg: "not found video",
      });
    }

    const result = await CommentModel.delete(comment_id);
    if (!result) {
      return res.status(400).json({
        status: 400,
        msg: "update comment fail",
      });
    }

    return res.status(200).json({
      status: 200,
      data: "ok",
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      msg: "delete comment fail",
    });
  }
};
