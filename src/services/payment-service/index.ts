
import paymentRepository from "@/repositories/payment-repository";
import { Payment } from "@prisma/client";
import ticketService from "../ticket-service/index";

async function getAllPayment(ticketId: number, userId: number): Promise<Payment> {
  await ticketService.getTicketById(ticketId);
  await ticketService.getTicketByIdandUser(ticketId, userId);
  const event = await paymentRepository.getAllPayment(ticketId);
  
  return event;
}

// async function createPayment(data, userId: number): Promise<Payment> {
//   await ticketService.getTicketById(ticketId);
//   await ticketService.getTicketByIdandUser(ticketId, userId);
//   const event = await paymentRepository.createPayment(ticketId);
  
//   return event;
// }

const paymentService = {
  getAllPayment
};

export default paymentService;
