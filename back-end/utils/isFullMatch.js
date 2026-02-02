export const isFullMatch = ({ ocr, payment }) => {
    if (!ocr) return false

    const amountMatch =
        ocr.amount !== null &&
        Number(ocr.amount) === Number(payment.amount)

    const refMatch =
        ocr.ref &&
        ocr.ref === payment.ref

    // เพิ่มเงื่อนไขได้ (วันที่, ธนาคาร ฯลฯ)
    return amountMatch && refMatch
}
