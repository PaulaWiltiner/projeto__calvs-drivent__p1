import { prisma } from "@/config";

async function findHotels() {
  return prisma.hotel.findMany({
    include: {
      Rooms: true,
    }
  });
}

async function findHotelById(hotelId: number) {
  return prisma.hotel.findUnique({
    where: {
      id: hotelId
    },
    include: {
      Rooms: true,
    }
  });
}

const hotelRepository = {
  findHotelById,
  findHotels,
};

export default hotelRepository;
