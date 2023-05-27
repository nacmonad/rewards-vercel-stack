import createPoint from '../../../functions/createPoints';
import { NextApiRequest, NextApiResponse } from 'next';

// /api/points
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        let initialAmount, issuerId, promotionId, productId;
        ({ initialAmount, issuerId, promotionId, productId } = req.body);
        console.log("[createPoints]", { initialAmount, issuerId, promotionId, productId })
        const point = await createPoint({initialAmount, issuerId, promotionId, productId});
        return res.status(200).json(point);
        }
      default:
        console.log('Unhandled Method');
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (err) {
    console.error(err);

    return res.status(500).json({message:err.message});
  } 
}
