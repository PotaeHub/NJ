import Tesseract from "tesseract.js"
import fs from "fs"

/**
 * อ่านข้อความจากสลิปโอนเงิน
 * @param {string} imagePath path ของรูป
 * @returns {Promise<{ raw: string, normalized: string, lines: string[] }>}
 */
export const readSlipText = async (imagePath) => {
    if (!fs.existsSync(imagePath)) {
        throw new Error("Slip image not found")
    }

    const result = await Tesseract.recognize(
        imagePath,
        "tha+eng",
        {
            logger: m => {
                if (m.status === "recognizing text") {
                    console.log(`OCR ${Math.round(m.progress * 100)}%`)
                }
            }
        }
    )

    const raw = result.data.text || ""

    /* ===============================
       Normalize text (สำคัญมาก)
    =============================== */
    const normalized = raw
        .replace(/\s+/g, " ")
        .replace(/[^\w\dก-๙.\-_/]/g, "")
        .toUpperCase()

    const lines = raw
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean)

    return {
        raw,
        normalized,
        lines
    }
}
