import { prisma } from "@/config";
import { Prisma, TicketType, Ticket } from "@prisma/client";

async function create(data: Prisma.TicketUncheckedCreateInput) {
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

async function getAllTicket(): Promise<Ticket[]> {
  return prisma.ticket.findMany({
    include: {
      TicketType: true,
    },
  });
}

const ticketRepository = {
  create,
  getAllTicketType,
  getAllTicket
};

export default ticketRepository;
