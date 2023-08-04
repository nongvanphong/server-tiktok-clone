const authModel = require("../models/auth.model");
const fs = require("fs");
const sharp = require("sharp");
//npm install sharp --ignore-scripts
const path = require("path");
exports.register = async (req, res) => {
  try {
    var d = new Date();
    const { email, password } = req.body;

    const checkMail = await authModel.findName(email);
    if (checkMail) {
      return res.status(409).json({
        status: 409,
        msg: "email already exist",
      });
    }

    const userid =
      d.getDate() +
      "l" +
      d.getSeconds() +
      "l" +
      d.getMilliseconds() +
      "l" +
      d.getHours() +
      d.getFullYear() +
      d.getMonth();
    const username =
      "user" +
      d.getDate() +
      d.getSeconds() +
      d.getMilliseconds() +
      d.getHours() +
      d.getFullYear() +
      d.getMonth();
    const data = {
      userid,
      email,
      password,
      username,
      status: 0,
    };

    const result = await authModel.create(data);
    return res.status(201).json({ status: 201, data: result });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 400, msg: "register Fail" });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authModel.login(email, password);
    if (!result) {
      return res.status(400).json({ status: 400, msg: "login Fail" });
    }
    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    return res.status(400).json({ status: 400, msg: "login Fail" });
  }
};
exports.findEmail = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const result = await authModel.findName(email);
    if (result) {
      return res.status(201).json({
        status: 201,
        data: "email already exist",
      });
    }

    return res.status(200).json({ status: 200, data: "Email dose not exist" });
  } catch (error) {
    return res.status(400).json({ status: 400, msg: "check email Fail" });
  }
};

exports.chanPassword = async (req, res) => {
  try {
    const id = req.user.id;
    const { passwordOld, passwordNew } = req.body;
    const checkPassword = await authModel.checkPassword(id, passwordOld);

    if (!checkPassword) {
      return res.status(400).json({ status: 400, msg: "Incorrect password" });
    }

    const result = await authModel.updatePassword(id, passwordNew);
    if (result == 0) {
      return res.status(400).json({ status: 400, msg: "change password fail" });
    }
    return res.status(200).json({ status: 200, data: "ok" });
  } catch (error) {
    return res.status(400).json({ status: 400, msg: "change password fail" });
  }
};
exports.changeName = async (req, res) => {
  try {
    const id = req.user.id;
    const { user_name } = req.body;

    const result = await authModel.updateName(id, user_name);
    if (result == 0) {
      return res.status(400).json({ status: 400, msg: "change username fail" });
    }
    return res
      .status(200)
      .json({ status: 200, data: await authModel.findPK(id) });
  } catch (error) {
    return res.status(400).json({ status: 400, msg: "change username fail" });
  }
};
function createFolder(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}
exports.avatar = async (req, res) => {
  try {
    const typer = path.extname(req.file.originalname);
    const imagePath = req.file.path;

    const id = req.user.id;
    const result = await authModel.findPK(id);
    if (!result) {
      return res.status(400).json({ status: 400, msg: "insert avart fail" });
    }
    const pathImageUser = result.dataValues.userimage;
    if (
      pathImageUser &&
      pathImageUser !== "tiktokmax.png" &&
      pathImageUser !== "tiktok32.png"
    ) {
      const remove50 = `./uploads/images/images_200/${id}/${pathImageUser}`;
      fs.unlink(remove50, (err) => {
        if (err) {
          console.error("Lỗi khi xóa tệp tin:", err);
        } else {
          console.log("Đã xóa tệp tin thành công");
        }
      });
      const removeMax = `./uploads/images/images_Max/${id}/${pathImageUser}`;
      fs.unlink(removeMax, (err) => {
        if (err) {
          console.error("Lỗi khi xóa tệp tin:", err);
        } else {
          console.log("Đã xóa tệp tin thành công");
        }
      });
    }

    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Lỗi khi xóa tệp tin:", err);
        } else {
          console.log("Đã xóa tệp tin thành công");
        }
      });
      return res.status(400).json({
        message: "không đúng định dạng ảnh jpg gif png",
      });
    }

    const image = sharp(req.file.path);

    const metadata = await image.metadata();
    const width = metadata.width;
    const height = metadata.height;

    if (width < 50 || height < 50) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Lỗi khi xóa tệp tin:", err);
        } else {
          console.log("Đã xóa tệp tin thành công");
        }
      });
      return res.status(400).json({ status: 400, msg: "insert avart fail" });
    }
    const icon = "F:\\Agriculuter\\sv\\uploads\\logo\\t.png";
    const fileExtension = path.extname(imagePath); // Phần mở rộng của tệp tin

    createFolder(`./uploads/images/images_200/${id}/`);
    createFolder(`./uploads/images/images_Max/${id}/`);
    const nameFileConver = `_${Date.now()}${typer}`;
    const image50Path = `./uploads/images/images_200/${id}/${nameFileConver}`;
    const imageMaxPath = `./uploads/images/images_Max/${id}/${nameFileConver}`;
    // Resize và lưu ảnh với chất lượng 200
    await sharp(imagePath)
      //   .composite([
      //     {
      //       input: icon,
      //       gravity: "southeast",
      //       blend: "over",
      //       top: 10,
      //       left: 10,
      //       opacity: 0.8,
      //     },
      //   ])
      .resize(Math.round(width * 0.2), Math.round(height * 0.2))
      .jpeg({ quality: 80 })
      .toFile(image50Path);

    // Resize và lưu ảnh với chất lượng 500
    await sharp(imagePath)
      .composite([
        {
          input: icon,
          gravity: "southeast",
          blend: "over",
          bottom: 20,
          right: 20,
          opacity: 0.8,
        },
      ])
      .resize(Math.round(width * 0.5), Math.round(height * 0.5))
      .jpeg({ quality: 80 })
      .toFile(imageMaxPath);

    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Lỗi khi xóa tệp tin:", err);
      } else {
        console.log("Đã xóa tệp tin thành công");
      }
    });

    const resultUpdate = await authModel.updateImage(id, nameFileConver);

    if (resultUpdate == 0) {
      return res.status(400).json({ status: 400, msg: "insert avart fail" });
    }
    return res
      .status(200)
      .json({ status: 200, data: await authModel.findPK(id) });
  } catch (error) {
    return res.status(400).json({ status: 400, msg: "insert avart fail" });
  }
};
exports.search = async (req, res) => {
  const { textSearch, _page } = req.query;
  //console.log("-=", textSearch, "r", _page);
  const _perPage = 10;
  let offset = (_page - 1) * _perPage;
  let limit = _perPage;
  const { count, rows } = await authModel.search(textSearch, limit, offset);

  return res.status(200).json({ status: 200, total: count, data: rows });
};
