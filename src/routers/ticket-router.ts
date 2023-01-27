import { Router } from "express";
import { createTicket, getAllTicket, getAllTicketType } from "@/controllers/ticket-controller";
import { authenticateToken } from "@/middlewares";

const ticketRouter = Router();

ticketRouter
  .all("/*", authenticateToken)
  .get("/", getAllTicket)
  .get("/types", getAllTicketType)
  .post("/", createTicket);

export { ticketRouter };

