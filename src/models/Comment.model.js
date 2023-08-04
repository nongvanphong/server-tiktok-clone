const { Commets, Users } = require("../../database/models/index");
class CommentModel {
  async create(newData) {
    return Commets.create(newData);
  }
  async delete(user_id, video_id) {
    return Commets.destroy({
      where: { userid: user_id, videoid: video_id },
    });
  }
  async getById(id) {
    return Commets.findByPk(id);
  }
  async getByIdVideo(id) {
    return Commets.findAndCountAll({
      where: { videoid: id },
      include: {
        model: Users,
      },
    });
  }
  async checkComment(id, vidoeid, comment_id) {
    return Commets.findAll({
      where: { videoid: vidoeid, userid: id, id: comment_id },
    });
  }
  async update(id, messenger) {
    return Commets.update(
      { messenger: messenger },
      {
        where: {
          id: id,
        },
      }
    );
  }
  async delete(id) {
    return Commets.destroy({
      where: { id: id },
    });
  }
  async deleteComment(id, transaction) {
    return Commets.destroy({
      where: { videoid: id },
      transaction,
    });
  }
}
module.exports = new CommentModel();
