// src/lib/services/userService.ts
import prisma from '@/lib/prisma';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async (data: Prisma.UserCreateInput): Promise<User> => {
  const hashedPassword = await bcrypt.hash(data.passwordHash, 10);
  return prisma.user.create({
    data: {
      ...data,
      passwordHash: hashedPassword,
    },
  });
};