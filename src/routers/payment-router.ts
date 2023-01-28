import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { createPayment, getAllPayment } from "@/controllers/payment-controller";

const paymentRouter = Router();

paymentRouter
  .all("/*", authenticateToken)
  .post("/process", createPayment)
  .get("", getAllPayment);

export { paymentRouter };

