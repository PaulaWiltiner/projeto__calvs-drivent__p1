import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicket,
  createTicketTypeRemoteAndIncludesHotel
} from "../factories";
import createRoom from "../factories/room-factor";
import createHotel from "../factories/hotel-factor";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels/id", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels/id");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels/id").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels/id").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 400 if query param hotelId is missing", async () => {
    const token = await generateValidToken();
  
    const response = await server.get("/hotels/id").set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toEqual(httpStatus.BAD_REQUEST);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when given ticket doesnt exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get("/hotels/id?hotelId=1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when enrollment doesnt exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/hotels/id?hotelId=1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when ticket doesnt exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get("/hotels/id?hotelId=1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when hotel doesnt exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemoteAndIncludesHotel(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/hotels/id?hotelId=1").set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 402 when ticket is not pay", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemoteAndIncludesHotel(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get("/hotels/id?hotelId=1").set("Authorization", `Bearer ${token}`);
    
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 402 when event is remote", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemoteAndIncludesHotel(true, false);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/hotels/id?hotelId=1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 402 when hotel is not include", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemoteAndIncludesHotel(false, false);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/hotels/id?hotelId=1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    // ultima de sucesso
    it("should respond with status 200 and with hotel data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemoteAndIncludesHotel(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const response = await server.get(`/hotels/id?hotelId=${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: hotel.name,
          image: hotel.image,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          Rooms: [
            {
              id: expect.any(Number),
              name: room.name,
              capacity: room.capacity,
              hotelId: hotel.id,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }] }),);
    });
  });
});
