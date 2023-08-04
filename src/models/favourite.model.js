const { Favourites } = require("../../database/models/index");
class FavouriteModel {
  async create(newData) {
    return Favourites.create(newData);
  }
  async delete(user_id, video_id) {
    return Favourites.destroy({
      where: { userid: user_id, videoid: video_id },
    });
  }
  async getById(favourite_id) {
    return Favourites.findByPk(favourite_id);
  }
  async getByIdUser(user_id, video_id) {
    return Favourites.findOne({
      where: {
        userid: user_id,
        videoid: video_id,
      },
    });
  }
  async deleteFavourite(video_id, transaction) {
    return Favourites.destroy(
      {
        where: {
          videoid: video_id,
        },
      },
      transaction
    );
  }
}
module.exports = new FavouriteModel();
