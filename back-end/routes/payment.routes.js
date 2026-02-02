import express from "express"
import { auth } from "../middleware/auth.middleware.js"
import { uploadGameMedia } from "../middleware/upload.middleware.js"
import {
    createPayment,
    uploadPaymentSlip
} from "../controller/payment.controller.js"

const router = express.Router()

router.post("/payments/create", auth, createPayment)
router.post(
    "/payments/upload-slip",
    auth,
    uploadGameMedia.single("slip"),
    uploadPaymentSlip
)

export default router
