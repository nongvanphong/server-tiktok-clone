const {
  Videos,
  Users,
  Favourites,

  Sequelize,
  sequelize,
} = require("../../database/models/index");
class videoRepo {
  // async getAll(limit, offset) {
  //   return Videos.findAll({
  //     include: {
  //       model: Users,
  //     },
  //     offset: offset,
  //     limit: limit,
  //   });
  // }
  async create(data) {
    return Videos.create(data);
  }
  async delete(video_id, transaction) {
    return Videos.destroy({
      where: { id: video_id },
      transaction,
    });
  }
  async getById(video_id) {
    return Videos.findByPk(video_id);
  }
  async getAll(limit, offset, myid) {
    // const query = `SELECT videos.id,videos.userid,videos.videotag, videos.videotitle,videos.videodescrible, videos.videouri, users.username, users.userimage, COALESCE(likes.like_number, 0) AS like_number, COALESCE(comments.cmt_number, 0) AS cmt_number FROM videos LEFT JOIN  users ON users.id = videos.userid LEFT JOIN  (SELECT videoid, COUNT(*) AS like_number FROM favourites GROUP BY videoid) AS likes ON likes.videoid = videos.id LEFT JOIN  (SELECT videoid, COUNT(*) AS cmt_number FROM commets GROUP BY videoid) AS comments ON comments.videoid = videos.id LIMIT ${limit} OFFSET  ${offset} `;
    const query = ` SELECT videos.updatedAt,  videos.createdAt,videos.id, videos.userid, videos.videotag, videos.videotitle,  videos.videodescrible, videos.videouri,users.username, users.userimage,   COALESCE(likes.like_number, 0) AS like_number,COALESCE(comments.cmt_number, 0) AS cmt_number,  CASE  WHEN EXISTS (SELECT 1 FROM favourites WHERE videoid = videos.id AND userid = ${myid}) THEN '0'  ELSE '1'  END AS your_liked FROM   videos LEFT JOIN   users ON users.id = videos.userid  LEFT JOIN     (SELECT videoid, COUNT(*) AS like_number FROM favourites GROUP BY videoid) AS likes ON likes.videoid = videos.id   LEFT JOIN   (SELECT videoid, COUNT(*) AS cmt_number FROM commets GROUP BY videoid) AS comments ON comments.videoid = videos.id
    ORDER BY  videos.updatedAt DESC
    LIMIT ${limit} OFFSET  ${offset}  `;

    const replacements = { limit: limit, offset: offset };
    console.log(Sequelize.QueryTypes.SELECT, replacements);
    return sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements,
    });
  }
  async getUserId(limit, offset, id) {
    return Videos.findAndCountAll({
      where: { userid: id },
      offset: offset,
      limit: limit,
    });
  }
  async checkVideoUpdate(id, userId) {
    return Videos.findOne({
      where: { id: id, userid: userId },
    });
  }
  async update(data, id) {
    return Videos.update(data, {
      where: { id: id },
    });
  }
}

module.exports = new videoRepo();
