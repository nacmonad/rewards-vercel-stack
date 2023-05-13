import createPoint from '../../../functions/createPoints';
import { NextApiRequest, NextApiResponse } from 'next';

// /api/points
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let initialAmount, issuerId, promotionId, productId;
    switch (req.method) {
      case 'GET': {
        initialAmount = Number(req.query.amount);
        issuerId = Number(req.query.issuerId);
        promotionId = req.query.promotionId ? Number(req.query.promotionId) : undefined;
        productId = req.query.productId ? Number(req.query.productId) : undefined;
        const point = await createPoint({initialAmount, issuerId, promotionId, productId});

        return res.status(200).json(point);
         }
      case 'POST': {
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
