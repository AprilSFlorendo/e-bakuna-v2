import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
	cloud_name: process.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

async function upload(file: Blob, folder: string) {
	const buffer = Buffer.from(await file.arrayBuffer());
	const base64 = buffer.toString('base64');

	const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64}`, {
		folder: folder
	});

	return result;
}

export { cloudinary, upload };
