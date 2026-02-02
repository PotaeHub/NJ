import multer from "multer";
import path from "path";
import fs from "fs";

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        let dir = "uploads";

        if (file.fieldname === "avatar") {
            dir += "/avatar";
        }
        else if (file.fieldname === "slip") {
            dir += "/slips";
        }
        else if (file.mimetype.startsWith("image")) {
            dir += "/games/images";
        }
        else if (file.mimetype.startsWith("video")) {
            dir += "/games/videos";
        }

        ensureDir(dir);
        cb(null, dir);
    },


    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {

    if (file.fieldname === "slip") {
        if (!file.mimetype.startsWith("image")) {
            return cb(new Error("Slip must be an image"), false);
        }
        return cb(null, true);
    }

    if (
        file.mimetype.startsWith("image") ||
        file.mimetype.startsWith("video")
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only image & video allowed"), false);
    }
};


export const uploadGameMedia = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024
    }
});
