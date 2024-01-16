import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { BUCKET_NAME, REGION, S3_ACCESS_KEY, S3_SECRET_KEY } from "./index.js";

const s3 = new S3Client({
	credentials: {
		secretAccessKey: S3_SECRET_KEY,
		accessKeyId: S3_ACCESS_KEY
	},
	region: REGION
});

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: BUCKET_NAME,
		contentType: multerS3.AUTO_CONTENT_TYPE,
		metadata: function (req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function (req, file, cb) {
			cb(null, `yolo${Date.now().toString()}`);
		}
	})
});

export { upload };
