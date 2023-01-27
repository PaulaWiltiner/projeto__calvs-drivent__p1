import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getAllPayment } from "@/controllers/payment-controller";

const paymentRouter = Router();

paymentRouter
  .all("/*", authenticateToken)
  .get("", getAllPayment);

export { paymentRouter };

