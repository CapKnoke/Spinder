import { PrismaClient } from '@prisma/client';

const resetLikes = async () => {
  const prisma = new PrismaClient();
  await prisma.user.update({
    where: { id: 'A1CNF2iiLfhOfC32OXq3T6IXfTD2' },
    data: { liked: { set: [] } },
  });
};

resetLikes();
