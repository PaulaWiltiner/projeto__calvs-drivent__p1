import { prisma } from "@/config";
import { Payment, Prisma } from "@prisma/client";

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

// async function create(data: dataPayment) {
//   return prisma.payment.create({
//     data:{
//       ticketId: data.ticketId,
//       value: data.cardData.number,
//       cardIssuer: data.cardData.issuer, // VISA | MASTERCARD
//       cardLastDigits: data.cardData.cardLastDigits,
//     }
//   });
// }

async function getAllPayment(ticketId: number): Promise<Payment> {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    }
  });
}

const paymentRepository = {
  // create,
  getAllPayment
};

export default paymentRepository;
