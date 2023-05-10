import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

/* /api/redeem 
*
*/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId, amount } = req.body;

    // Find all available points whose currentAmount > 0
    const availablePoints = await prisma.point.findMany({
      where: {
        ownerId: userId,
        currentAmount: {
          gt: 0,
        },
      },
      orderBy: {
        currentAmount: 'asc',
      },
    });

    // Calculate the total available points
    const totalPoints = availablePoints.reduce(
      (sum, point) => sum + point.currentAmount,
      0
    );

    // If the total available points is less than the requested amount, return an error
    if (totalPoints < amount) {
      return res.status(400).json({
        error: `Insufficient points. Available points: ${totalPoints}`,
      });
    }

    // Redeem the required amount of points
    let redeemedPoints = 0;
    for (const point of availablePoints) {
      if (redeemedPoints < amount) {
        const remainingPoints = amount - redeemedPoints;
        const redemptionAmount = Math.min(remainingPoints, point.currentAmount);

        /* JWT Validate Point Body */

        await prisma.redemption.create({
          data: {
            redeemedAmount: redemptionAmount,
            point: {
              connect: {
                id: point.id,
              },
            },
            redeemedBy: {
              connect: {
                id: userId,
              },
            },
          },
        });
        await prisma.point.update({
          where: {
            id: point.id,
          },
          data: {
            currentAmount: point.currentAmount - redemptionAmount,
          },
        });
        redeemedPoints += redemptionAmount;
      } else {
        break;
      }
    }

    return res.status(200).json({ message: 'Points redeemed successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}
