// soubor: src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

declare global {
  // Povolíme globální `var` pro `prisma`
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;