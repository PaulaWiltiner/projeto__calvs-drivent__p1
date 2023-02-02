import faker from "@faker-js/faker";
import { prisma } from "@/config";

export default async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });
}
