import { AuthenticatedRequest } from "@/middlewares";
import hotelService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  try {
    const hotelId = Number(req.query.hotelId);
    const { userId } = req;

    if (!hotelId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    const hotel = await hotelService.getHotelById(hotelId, userId );

    if (!hotel) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if (error.code===402) {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;

    const hotels = await hotelService.getHotels(userId );

    if (hotels.length===0) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if (error.code===402) {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
