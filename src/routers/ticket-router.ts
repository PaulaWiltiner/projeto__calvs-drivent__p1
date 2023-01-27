import { Router } from "express";
import { createTicket, getAllTicket, getAllTicketType } from "@/controllers/ticket-controller";
import { authenticateToken } from "@/middlewares";

const ticketRouter = Router();

ticketRouter
  .get("/", getAllTicket)
  .get("/types", getAllTicketType)
  .post("/types", createTicket)
  .all("/*", authenticateToken);

export { ticketRouter };

