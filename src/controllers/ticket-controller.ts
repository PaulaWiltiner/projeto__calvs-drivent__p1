import { AuthenticatedRequest } from "@/middlewares";
import ticketService from "@/services/ticket-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;

  try {
    const ticketList = await ticketService.createTicket(ticketTypeId, userId);

    return res.status(httpStatus.CREATED).send(ticketList);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getAllTicket(res: Response) {
  try {
    const event = await ticketService.getAllTicket();
    if(event.length===0) res.status(httpStatus.NOT_FOUND).send({});
    return res.status(httpStatus.OK).send(event);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getAllTicketType(res: Response) {
  try {
    const event = await ticketService.getAllTicketType();
    if(event.length===0) res.status(httpStatus.OK).send({});
    return res.status(httpStatus.OK).send(event);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}
