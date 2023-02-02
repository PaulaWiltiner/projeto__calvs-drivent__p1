
import hotelRepository from "@/repositories/hotels-repository";
import ticketsService from "@/services/tickets-service";

async function getHotels(userId: number) {
  const ticket = await ticketsService.getTicketByUserId(userId);
  
  if(ticket.TicketType.isRemote) throw { code: 402 };
  if(!ticket.TicketType.includesHotel) throw { code: 402 };
  if(ticket.status==="RESERVED") throw { code: 402 };
 
  const hotels = await hotelRepository.findHotels();

  return hotels;
}

async function getHotelById(hotelId: number, userId: number) {
  const ticket = await ticketsService.getTicketByUserId(userId);
  if(ticket.TicketType.isRemote) throw { code: 402 };
  if(!ticket.TicketType.includesHotel) throw { code: 402 };
  if(ticket.status==="RESERVED") throw { code: 402 };

  const hotel = await hotelRepository.findHotelById(hotelId);

  return hotel;
}

const hotelService = {
  getHotels,
  getHotelById
};

export default hotelService;
