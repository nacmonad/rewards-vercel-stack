import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { Point, User } from '@prisma/client';


const isAdmin = async (req: NextApiRequest) => {
    // const session = await getSession({ req })
    // const user = await prisma.user.findUnique({
    //   where: {
    //     email: session?.user?.email as string,
    //   },
    //   include: {
    //     role: true,
    //   },
    // })
    // return user?.role?.name === 'admin'
    return false
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users: User[] = await prisma.user.findMany({
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

    // Add totalPointsValue field to each user object
    const usersWithPoints = users.map((user : { points: Point[]} & User) => {
        const totalPointsValue = user.points
        .map((point) => point.currentAmount)
        .reduce((acc, curr) => acc + curr, 0)
        return {
        ...user,
        totalPointsValue
    }});

    res.status(200).json(usersWithPoints);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  } finally {
    await prisma.$disconnect();
  }
}
