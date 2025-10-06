// src/lib/services/clientService.ts

import prisma from '@/lib/prisma';
import type { Prisma, Client } from '@prisma/client';

export const getAllClients = async (): Promise<Client[]> => {
  return prisma.client.findMany();
};

export const getClientById = async (id: number): Promise<Client | null> => {
  return prisma.client.findUnique({
    where: { id },
  });
};

export const createClient = async (data: Prisma.ClientCreateInput): Promise<Client> => {
  return prisma.client.create({
    data,
  });
};

export const updateClient = async (id: number, data: Prisma.ClientUpdateInput): Promise<Client> => {
  return prisma.client.update({
    where: { id },
    data,
  });
};

export const deleteClient = async (id: number): Promise<Client> => {
  // Zde může být v budoucnu potřeba ošetřit závislosti (rezervace, transakce)
  return prisma.client.delete({
    where: { id },
  });
};