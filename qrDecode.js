const Jimp = require('jimp');
const QrCode = require('qrcode-reader');

exports.decodeQR = async (filePath) => {
  const image = await Jimp.read(filePath);
  return new Promise((resolve, reject) => {
    const qr = new QrCode();
    qr.callback = (err, value) => {
      if (err) reject(err);
      else resolve(value?.result);
    };
    qr.decode(image.bitmap);
  });
};
