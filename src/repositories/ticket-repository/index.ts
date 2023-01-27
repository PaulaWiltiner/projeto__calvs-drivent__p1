import { prisma } from "@/config";
import { TicketType, Ticket } from "@prisma/client";

async function create(data: Omit<Ticket, "id" |"createdAt" | "updatedAt" >) {
  return prisma.ticket.create({
    data,
    include: {
      TicketType: true,
    },
  });
}

async function getAllTicketType(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function getAllTicket(userId: number): Promise<Ticket[]> {
  return prisma.ticket.findMany({
    where: {
      Enrollment: {
        userId
      }
    },
    include: {
      TicketType: true,
    },
  });
}

async function getOneTicket(ticketId: number): Promise<Ticket> {
  return prisma.ticket.findUnique({
    where: {
      id: ticketId
    }
  });
}

const ticketRepository = {
  create,
  getAllTicketType,
  getAllTicket,
  getOneTicket
};

export default ticketRepository;
