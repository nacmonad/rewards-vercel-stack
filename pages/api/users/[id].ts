import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { User , Point} from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = parseInt(req.query.id as string, 10);

  try {
    const user: { points: Point[]} & User | null = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        roleId: true,
        name: true,
        email: true,
        password: true,
        role: true,
        points: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const totalPointsValue = user.points
    .map((point) => point.currentAmount)
    .reduce((acc, curr) => acc + curr, 0)

    // Add totalPointsValue field to user object
    const userWithPoints = {
      ...user,
      totalPointsValue
    };

    res.status(200).json(userWithPoints);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  } finally {
    await prisma.$disconnect();
  }
}
