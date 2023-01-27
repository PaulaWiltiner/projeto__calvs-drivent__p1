import { AuthenticatedRequest } from "@/middlewares";
import ticketService from "@/services/ticket-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;
  if(!ticketTypeId)return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const ticketList = await ticketService.createTicket(ticketTypeId, userId);

    return res.status(httpStatus.CREATED).send(ticketList);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getAllTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const event = await ticketService.getAllTicket(userId);
    if(event.length===1) res.status(httpStatus.OK).send(event[0]);
    return res.status(httpStatus.OK).send(event);
  } catch (error) {
    if(error.code==="404") return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getAllTicketType(req: AuthenticatedRequest, res: Response) {
  try {
    const event = await ticketService.getAllTicketType();
    if(event.length===0) res.send([]);
    return res.status(httpStatus.OK).send(event);
  } catch (error) {
    if(error.code==="404") return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
