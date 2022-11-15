import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@acme/db';

const users = async (req: NextApiRequest, res: NextApiResponse) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
};

export default users;
