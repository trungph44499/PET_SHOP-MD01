var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");
var multer = require("multer");
var ip = require("../config/ipconfig.json");

router.get("/", function (req, res, next) {
  res.send({ status: 200 });
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const email = req.body.email;
      const dir = path.join(__dirname, "..", "uploads", email);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = Date.now() + ext;
      cb(null, filename);
    },
  }),
});

router.post("/upload", upload.single("avatar"), (req, res) => {
  const file = req.file;
  const email = req.body.email;

  if (!file) {
    return res.status(400).json({ filePath: "", status: "No file uploaded" });
  }

  const filePath = `http://${ip.ip}/${email}/${file.filename}`;
  res.json({ filePath, status: "Complete" });
});

module.exports = router;
