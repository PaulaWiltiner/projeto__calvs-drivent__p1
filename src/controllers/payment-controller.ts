import { AuthenticatedRequest } from "@/middlewares";
import paymentService from "@/services/payment-service";
import { Response } from "express";
import httpStatus from "http-status";

// export async function createPayment(req: AuthenticatedRequest, res: Response) {
//   const { userId } = req;
//   const data = req.body;
//   if(!data.cardData || !data.ticketId)return res.sendStatus(httpStatus.BAD_REQUEST);

//   try {
//     const payment = await paymentService.createPayment(data, userId);

//     return res.status(httpStatus.CREATED).send(payment);
//   } catch (error) {
//     return res.sendStatus(httpStatus.NOT_FOUND);
//   }
// }

export async function getAllPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketId } = req.query as Record<string, string>;
  if(ticketId===undefined) res.sendStatus(httpStatus.BAD_REQUEST);
  try {
    const event = await paymentService.getAllPayment(Number(ticketId), userId);
    return res.status(httpStatus.OK).send(event);
  } catch (error) {
    if(error.code==="404") return res.sendStatus(httpStatus.NOT_FOUND);
    if(error.code==="401") return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}
