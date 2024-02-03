import sharp from 'sharp';

export default async function (req, res) {
    const { width, height, url } = req.query;
    const image = await sharp(url).resize(+width, +height).toBuffer();
    res.end(image);
    }