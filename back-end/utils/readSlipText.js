import Tesseract from "tesseract.js";

export const readSlipText = async (imagePath) => {
    const { data } = await Tesseract.recognize(
        imagePath,
        "tha+eng",
        {
            logger: m => console.log(m.status)
        }
    )

    const text = data.text || ""

    return {
        rawText: text,
        amount: extractAmount(text),
        ref: extractRef(text),
        date: extractDate(text)
    }
}

/* ===== Helpers ===== */

const extractAmount = (text) => {
    // ดึงยอดเงิน เช่น 1,234.00
    const match = text.replace(/,/g, "").match(/(\d+\.\d{2})/)
    return match ? Number(match[1]) : null
}

const extractRef = (text) => {
    // ORDER_123
    const match = text.match(/ORDER_\d+/)
    return match ? match[0] : null
}

const extractDate = (text) => {
    // 01/02/2026
    const match = text.match(/\d{2}\/\d{2}\/\d{4}/)
    return match ? match[0] : null
}
