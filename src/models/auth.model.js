const { Users } = require("../../database/models/index");
const { Op, fn, col } = require("sequelize");
class usersRepo {
  async getAll() {
    return Users.findAll();
  }
  async create(data) {
    return Users.create(data);
  }
  async findName(email) {
    return Users.findOne({ where: { email: email } });
  }
  async login(email, password) {
    return Users.findOne({
      where: {
        email: { [Op.eq]: email },
        password: password,
      },
    });
  }
  async findPK(id) {
    return Users.findByPk(id);
  }
  async checkPassword(id, password) {
    return Users.findOne({
      where: {
        id: id,
        password: password,
      },
    });
  }
  async updatePassword(id, password) {
    return Users.update(
      { password: password },
      {
        where: {
          id: id,
        },
      }
    );
  }
  async updateName(id, username) {
    return Users.update(
      { username: username },
      {
        where: {
          id: id,
        },
      }
    );
  }
  async updateImage(id, image) {
    return Users.update(
      { userimage: image },
      {
        where: {
          id: id,
        },
      }
    );
  }
  async search(textSearch, limit, offset) {
    let whereCondition = {};
    if (textSearch) {
      whereCondition = {
        [Op.or]: [
          { email: { [Op.like]: `%${textSearch}%` } },
          { username: { [Op.like]: `%${textSearch}%` } },
        ],
      };
    }
    return Users.findAndCountAll({
      where: whereCondition,
      offset: offset,
      limit: limit,
    });
  }
}
module.exports = new usersRepo();
