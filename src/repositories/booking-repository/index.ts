import { prisma } from "@/config";
 
async function findBooking(userId: number) {
  return prisma.booking.findMany({
    where: {
      userId,
    },
    include: {
      Room: true,
    }
  });
}

async function createBooking( roomId: number, userId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    }
  });
}

async function updateBooking(
  bookingId: number,
  roomId: number
) {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId
    }
  });
}

const  bookingRepository = {
  findBooking,
  updateBooking,
  createBooking
};

export default bookingRepository;
