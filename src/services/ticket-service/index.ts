import { notFoundError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import { TicketType, Ticket } from "@prisma/client";
import enrollmentsService from "../enrollments-service/index";

async function getAllTicketType(): Promise<TicketType[]> {
  const event = await ticketRepository.getAllTicketType();
  if (!event) throw notFoundError();

  return event;
}

async function getAllTicket(): Promise<Ticket[]> {
  const event = await ticketRepository.getAllTicket();
  if (!event) throw notFoundError();

  return event;
}

async function createTicket(ticketTypeId: number, userId: number) {
  const enrollmentId= await enrollmentsService.getOneEnrollment(userId);
  const data = {
    ticketTypeId,
    enrollmentId: enrollmentId,
    status: "reserved"
  };
 
  const event = await ticketRepository.create(data);
  return event;
}

const eventsService = {
  getAllTicketType,
  getAllTicket,
  createTicket,
};

export default eventsService;
