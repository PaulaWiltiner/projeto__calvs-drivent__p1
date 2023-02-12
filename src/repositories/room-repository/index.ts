import { prisma } from "@/config";
 
async function findRoom(roomId: number) {
  return prisma.room.findUnique({
    where: {
      id: roomId
    }
  });
}

const  roomRepository = {
  findRoom,
};

export default roomRepository;
