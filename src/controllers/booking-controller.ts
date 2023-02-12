import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const booking = await bookingService.getBooking( userId );

  return res.status(httpStatus.OK).send(booking);
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const roomId = Number(req.body.roomId);
    const { userId } = req;

    const booking = await bookingService.postBooking(userId, roomId);

    return res.status(httpStatus.OK).send({
      bookingId: booking.id });
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if (error.code===403) {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if (error.code===404) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const roomId = Number(req.body.roomId);
    const bookingId = Number(req.query.bookingId);

    const booking = await bookingService.putBooking(roomId, bookingId );
    return res.status(httpStatus.OK).send({
      bookingId: booking.id });  
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if (error.code===403) {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if (error.code===404) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
}
