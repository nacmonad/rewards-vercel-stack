import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../lib/prisma';

/* /api/points/[id]/redemptions/[id]
*
*/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    const redemption = await prisma.redemption.findUnique({
      where: {
        id: parseInt(id as string)
      },
      include: {
        point: true,
        redeemedBy: true
      }
    });

    if (!redemption) {
      return res.status(404).json({ message: 'Redemption not found' });
    }

    res.status(200).json({ redemption });

  } catch (err) {
    console.error(err);

    return res.status(500).json({message:err.message});
  } 
}
