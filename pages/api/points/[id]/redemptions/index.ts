import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../lib/prisma';

/* /api/points/[id]/redemptions
*
*/
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pointId = req.query.point_id as string;

  switch (req.method) {
    case 'GET': {
      try {
        const redemptions = await prisma.redemption.findMany({
          where: { pointId: parseInt(pointId) },
        });
        return res.status(200).json(redemptions);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
      }
    }
    case 'POST': {
      const { redeemedAmount, redeemedById } = req.body;
      const point = await prisma.point.findUnique({
        where: { id: parseInt(pointId) },
      });
      if (!point) {
        return res.status(404).json({ message: 'Point not found' });
      }
      if (redeemedAmount > point.currentAmount) {
        return res.status(400).json({ message: 'Insufficient points' });
      }
      try {
        const redemption = await prisma.redemption.create({
          data: {
            redeemedAmount,
            redeemedBy: { connect: { id: parseInt(redeemedById) } },
            point: { connect: { id: parseInt(pointId) } },
          },
        });
        await prisma.point.update({
          where: { id: parseInt(pointId) },
          data: { currentAmount: point.currentAmount - redeemedAmount },
        });
        return res.status(201).json(redemption);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
      }
    }
    default:
      console.log('Unhandled Method');
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
