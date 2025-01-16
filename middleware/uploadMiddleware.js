const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");
require("dotenv").config();
const sharp = require('sharp');
const stream = require('stream');


const mongoURI = process.env.dbURI;

const conn = mongoose.createConnection(mongoURI);

let gfs;
const gfsPromise = new Promise((resolve, reject) => {
  conn.once("open", () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: "uploads",
    });
    console.log("GridFS initialized");
    resolve(gfs);
  });
  conn.on("error", (err) => reject(err));
});

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      bucketName: "uploads",
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

const processImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    // Process image with Sharp
    const processedBuffer = await sharp(req.file.buffer)
      .resize(800, 600, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Create a unique filename
    const filename = `${Date.now()}-${req.file.originalname}`;

    // Save to GridFS
    const uploadStream = gfs.openUploadStream(filename, {
      contentType: 'image/jpeg'
    });

    // Create a readable stream from the processed buffer
    const readableStream = new stream.PassThrough();
    readableStream.end(processedBuffer);

    // Return a promise that resolves when the upload is complete
    await new Promise((resolve, reject) => {
      readableStream.pipe(uploadStream)
        .on('finish', () => {
          req.file.id = uploadStream.id;
          req.file.filename = filename;
          resolve();
        })
        .on('error', reject);
    });

    next();
  } catch (error) {
    next(error);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = { upload, getGfs: () => gfsPromise,processImage };
