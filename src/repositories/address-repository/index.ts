import { prisma } from "@/config";
import { Address } from "@prisma/client";

async function upsert(enrollmentId: number, createdAddress: CreateAddressParams, updatedAddress: UpdateAddressParams) {
  return prisma.address.upsert({
    where: {
      enrollmentId,
    },
    create: {
      ...createdAddress,
      Enrollment: { connect: { id: enrollmentId } },
    },
    update: updatedAddress,
  });
}

export async function findByCep(cep: string) {
  return prisma.address.findMany({
    where: {
      cep,
    }
  });
}

export type CreateAddressParams = Omit<Address, "id" | "createdAt" | "updatedAt" | "enrollmentId">;
export type UpdateAddressParams = CreateAddressParams;

const addressRepository = {
  upsert,
  findByCep
};

export default addressRepository;
