
import ticketRepository from "@/repositories/ticket-repository";
import { TicketType, Ticket } from "@prisma/client";
import { TicketStatus } from "@prisma/client";
import enrollmentsService from "../enrollments-service/index";

async function getAllTicketType(): Promise<TicketType[]> {
  const event = await ticketRepository.getAllTicketType();

  return event;
}

async function getAllTicket(userId: number): Promise<Ticket[]> {
  const event = await ticketRepository.getAllTicket(userId);
  if (event.length===0) throw { code: "404" };

  return event;
}

async function getTicketById(ticketId: number) {
  const event = await ticketRepository.getOneTicket(ticketId);
  if (!event) throw { code: "404" };
}

async function getTicketByIdandUser(ticketId: number, userId: number) {
  const enrollmentId= await enrollmentsService.getOneEnrollment(userId);
  if (!enrollmentId) throw { code: "401" };
  const event = await ticketRepository.getOneTicket(ticketId);
  if (event.enrollmentId!==enrollmentId) throw { code: "401" };
}

async function createTicket(ticketTypeId: number, userId: number) {
  const enrollmentId= await enrollmentsService.getOneEnrollment(userId);
  const data = {
    ticketTypeId,
    enrollmentId: enrollmentId,
    status: TicketStatus.RESERVED,
  };
 
  const event = await ticketRepository.create(data);
  return event;
}

const eventsService = {
  getAllTicketType,
  getAllTicket,
  createTicket,
  getTicketById,
  getTicketByIdandUser
};

export default eventsService;
