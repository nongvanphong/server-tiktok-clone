const videoRepo = require("../models/videoRepo");
const FavouriteModel = require("../models/favourite.model");
exports.favouriteVideo = async (req, res) => {
  const id = req.user.id;
  const video_id = req.body.video_id;
  console.log(video_id);
  const dataVideo = await videoRepo.getById(video_id);

  if (!dataVideo)
    return res.status(404).json({
      status: 404,
      msg: "id does not exist",
    });

  const user = await FavouriteModel.getByIdUser(id, video_id);

  if (!user) {
    const newData = {
      userid: id,
      videoid: video_id,
    };
    const result = await FavouriteModel.create(newData);

    if (!result) {
      return res.status(400).json({
        status: 400,
        msg: "create favourite fail",
      });
    }
    return res.status(200).json({
      status: 200,
      data: "ok",
    });
  }
  await FavouriteModel.delete(id, video_id);
  return res.status(200).json({
    status: 200,
    data: "ok",
  });
};
