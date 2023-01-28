import { prisma } from "@/config";
import { Payment } from "@prisma/client";

export type dataPayment= {
  ticketId: number,
	cardData: {
		issuer: string,
    number: number,
    name: string,
    expirationDate: Date,
    cvv: number
	}
}

async function create(data: Omit<Payment, "id" | "createdAt" | "updatedAt">) {
  return prisma.payment.create({
    data
  });
}

async function getAllPayment(ticketId: number, userId: number ): Promise<Payment[]> {
  return prisma.payment.findMany({
    where: {
      ticketId,
      Ticket: {
        Enrollment: {
          userId
        }
      }
    }
  });
}

const paymentRepository = {
  create,
  getAllPayment
};

export default paymentRepository;
