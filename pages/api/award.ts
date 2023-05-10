import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient, Point } from '@prisma/client';
import { JWTCodeTokenPayload } from '../../types';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    /* Get userId from auth token */

    /* Validate the Code 
    *  Implement JWT verification
    */

    const { userId, code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Missing code' });
    }
    if (!userId) {
        return res.status(400).json({ message: 'Missing userId'})
    }

    let payload: JWTCodeTokenPayload;

    try {
      payload = jwt.verify(code, process.env.POINTS_JWT_SECRET!) as JWTCodeTokenPayload;
    } catch (err) {
      return res.status(401).json({ message: 'Invalid code' });
    }

    const point = await prisma.point.findUnique({ where: { code } });

    if (!point) {
      return res.status(404).json({ message: 'Point not found' });
    }

    if (point.ownerId || point.awardedAt) {
      return res.status(409).json({ message: 'Point already awarded' });
    }

    await prisma.point.update({
      where: { id: point.id },
      data: { ownerId: userId, awardedAt: new Date() },
    });

    return res.status(200).json({ message: 'Point awarded successfully' });
  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: err.message });
  } finally {
    await prisma.$disconnect();
  }
}
