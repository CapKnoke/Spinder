import { PrismaClient } from '@prisma/client';

const resetMatches = async () => {
  const prisma = new PrismaClient();
  await prisma.match.deleteMany();
  await prisma.user.update({
    where: { id: 'A1CNF2iiLfhOfC32OXq3T6IXfTD2' },
    data: { liked: { set: [] }, swiped: { set: [] } },
  });
};

resetMatches();
