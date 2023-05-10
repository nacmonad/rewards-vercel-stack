import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

// /api/points/[id]
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = 1; // Replace with actual userId from authToken
  
  try {
    const pointId = Number(req.query.id);

    switch (req.method) {
      case 'GET': {
        const point = await prisma.point.findUnique({ where: { id: pointId } });

        if (!point) {
          return res.status(404).json({ error: `Point with id ${pointId} not found` });
        }

        return res.status(200).json(point);
      }
      case 'PUT': {
        const { ownerId } = await prisma.point.findUnique({ where: { id: pointId }, select: { ownerId: true } });

        if (ownerId !== userId) {
          return res.status(403).json({ error: 'You do not have permission to update this point' });
        }

        const { currentAmount } = req.body;
        const updatedPoint = await prisma.point.update({
          where: { id: pointId },
          data: { currentAmount },
        });

        return res.status(200).json(updatedPoint);
      }
      case 'DELETE': {
        const { ownerId } = await prisma.point.findUnique({ where: { id: pointId }, select: { ownerId: true } });

        if (ownerId !== userId) {
          return res.status(403).json({ error: 'You do not have permission to delete this point' });
        }

        await prisma.point.delete({ where: { id: pointId } });

        return res.status(200).json({ message: `Point with id ${pointId} deleted successfully` });
      }
      default:
        console.log('Unhandled Method');
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
    
  } catch (err) {
    console.error(err);

    return res.status(500).json({ error: err.message });
  } 
}
