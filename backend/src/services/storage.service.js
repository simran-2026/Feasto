const ImageKit = require("imagekit");

let imagekit; // Declare but don't initialize yet

function initializeImageKit() {
  if (!imagekit) {
    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
    console.log("✅ ImageKit initialized successfully");
  }
  return imagekit;
}

async function uploadFile(file, fileName) {
  const kit = initializeImageKit(); // Initialize lazily
  const result = await kit.upload({
    file: file,
    fileName: fileName,
  });
  return result;
}

module.exports = { uploadFile };
