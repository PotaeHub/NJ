import { imageHash } from "image-hash";
import { promisify } from "util";

const imageHashAsync = promisify(imageHash);

export const getImageHash = async (path) => {
    // phash 16 bits
    return await imageHashAsync(path, 16, true);
}
