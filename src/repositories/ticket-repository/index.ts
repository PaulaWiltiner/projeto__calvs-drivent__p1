import { prisma } from "@/config";
import { TicketType, Ticket } from "@prisma/client";

export type TicketWithType = {
  id: number,
  status: string, //RESERVED | PAID
  ticketTypeId: number,
  enrollmentId: number,
  TicketType: {
    id: number,
    name: string,
    price: number,
    isRemote: boolean,
    includesHotel: boolean,
    createdAt: Date,
    updatedAt: Date,
  },
  createdAt: Date,
  updatedAt: Date,
}

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

async function getOneTicket(ticketId: number): Promise<TicketWithType> {
  return prisma.ticket.findUnique({
    where: {
      id: ticketId
    },
    include: {
      TicketType: true,
    },
  });
}

async function getTicketWithUser(ticketId: number, userId: number ): Promise<Ticket> {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
      Enrollment: {
        userId
      }
    }
  });
}

export async function updateTicketId(ticketId: number) {
  await prisma.ticket.update({
    where: {
      id: ticketId
    },
    data: {
      status: "PAID"
    },
  });
}

const ticketRepository = {
  create,
  getAllTicketType,
  getAllTicket,
  getOneTicket,
  getTicketWithUser,
  updateTicketId
};

export default ticketRepository;
