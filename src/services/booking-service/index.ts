
import bookingRepository from "@/repositories/booking-repository";
import roomRepository from "@/repositories/room-repository";
import { exclude } from "@/utils/prisma-utils";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function rulesOne(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw { code: 403 };
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw { code: 403 };
  }
}

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBooking(userId);
  if (booking.length===0) {
    throw { code: 404 };
  }
  return booking;
}

async function postBooking(userId: number, roomId: number) {
  await rulesOne(userId);
  const room = await roomRepository.findRoom(roomId);

  if (!room) {
    throw { code: 404 };
  }

  if (room.capacity===0) {
    throw { code: 404 };
  }
  const booking = await bookingRepository.createBooking(roomId, userId);
  return exclude(booking, "userId");
}

async function putBooking(bookingId: number, roomId: number) {
  const room = await roomRepository.findRoom(roomId);

  if (!room) {
    throw { code: 404 };
  }

  if (room.capacity===0) {
    throw { code: 404 };
  }

  const booking = await bookingRepository.updateBooking(bookingId, roomId);

  return booking;
}

const bookingService = {
  getBooking,
  putBooking,
  postBooking
};

export default bookingService;
