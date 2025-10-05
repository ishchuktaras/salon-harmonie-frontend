// src/lib/services/serviceService.ts

import prisma from '@/lib/prisma';
import type { Prisma, Service } from '@prisma/client';

export const getAllServices = async (): Promise<Service[]> => {
  return prisma.service.findMany();
};

export const getServiceById = async (id: number): Promise<Service | null> => {
  return prisma.service.findUnique({
    where: { id },
  });
};

export const createService = async (data: Prisma.ServiceCreateInput): Promise<Service> => {
  return prisma.service.create({
    data,
  });
};

export const updateService = async (id: number, data: Prisma.ServiceUpdateInput): Promise<Service> => {
  return prisma.service.update({
    where: { id },
    data,
  });
};

export const deleteService = async (id: number): Promise<Service> => {
  return prisma.service.delete({
    where: { id },
  });
};