
import paymentRepository from "@/repositories/payment-repository";
import { dataPayment } from "@/repositories/payment-repository";
import { Payment } from "@prisma/client";
import ticketService from "../ticket-service/index";

async function getAllPayment(ticketId: number, userId: number): Promise<Payment[]> {
  await ticketService.getTicketById(ticketId);
  const event = await paymentRepository.getAllPayment(ticketId, userId);
  
  if (event.length===0) throw { code: "401" };

  return event;
}

async function createPayment(data: dataPayment, userId: number): Promise<Payment> {
  const ticket = await ticketService.getTicketById(data.ticketId);
  await ticketService.getTicketWithUser(data.ticketId, userId);

  const dataPay = {
    ticketId: data.ticketId,
    value: ticket.TicketType.price,
    cardIssuer: data.cardData.issuer, // VISA | MASTERCARD
    cardLastDigits: data.cardData.number.toString().slice(-4)
  };

  const event = await paymentRepository.create( dataPay );

  await ticketService.updateTicket(data.ticketId);
  
  return event;
}

const paymentService = {
  getAllPayment,
  createPayment
};

export default paymentService;
