import jwt from 'jsonwebtoken'
import { PrismaClient, UserRole, Point } from '@prisma/client'
import { Issuer,CreatePointArgs, JWTCodeTokenPayload } from '../types'
import { spawn } from 'child_process'
import path from 'path'
const prisma = new PrismaClient()

async function generateQRCode(pointId: number, body: any) {
  const filename = `qr_point_${pointId}.png`;
  const filepath = path.join(__dirname, '../../../../', 'qr_codes', filename);
  console.log(filepath);
  
  //const logoPath = path.join(__dirname, '../../../../', './public/assets/logo.png'); // Path to the logo image file

  return new Promise<void>((resolve, reject) => {
    //const child = spawn('qrencode', ['-t', 'PNG', '-o', filepath, '-l', logoPath, '-L', 'M', JSON.stringify(body)], { stdio: 'pipe' });
    const child = spawn('qrencode', ['-t', 'PNG', '-o', filepath, JSON.stringify(body)], { stdio: 'pipe' });

    child.stdin.end();
    child.on('error', (err) => {
      console.log("[qrErr]", err);
    });

    child.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Failed to generate QR code: ${code}`));
      } else {
        resolve();
      }
    });
  });
}




export default async function createPoints({ initialAmount, issuerId, promotionId, productId }: CreatePointArgs): Promise<{ point: Point }> {
  try {
    const issuer: Issuer | null = await prisma.user.findUnique({
      where: {
        id: issuerId
      },
      select: {
        id: true,
        roleId: true,
        role:true
      }
    })
    if (!issuer || (issuer.role.name !== 'admin' && issuer.role.name !== 'sales')) {
      throw new Error('User does not have the necessary role to create a point')
    }

    const payload: JWTCodeTokenPayload = {
      initialAmount,
      currentAmount:initialAmount,
      issuerId: issuerId
    }
    if (promotionId) {
      payload.promotionId = promotionId
    }
    if (productId) {
      payload.productId = productId
    }

    const token = jwt.sign(payload, process.env.POINTS_JWT_SECRET!);
    const point = await prisma.point.create({
      data: {
        initialAmount,
        currentAmount:initialAmount,
        issuerId: issuerId,
        code: token,
        ownerId: null
      }
    })
    console.log("createdPoint", point)
    const qrcodeBody = { url: "example.com", code: token }
    await generateQRCode(point.id, qrcodeBody);

    return { point }
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect()
  }
}
