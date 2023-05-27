import jwt from 'jsonwebtoken'
import { PrismaClient, UserRole, Point } from '@prisma/client'
import { Issuer,CreatePointArgs, JWTCodeTokenPayload } from '../types'
import { spawn } from 'child_process'
import path from 'path'
const prisma = new PrismaClient()

async function generateCoupon(qrCodeFilepath : string) {
  return new Promise<void>((resolve, reject) => {

    const scriptname = `generateCouponWithQRCode.sh`;
    const scriptpath = path.join(__dirname, '../../../../scripts', scriptname);
    const child = spawn('bash', [scriptpath, qrCodeFilepath], { stdio: 'pipe' });

    child.stdout.on('data', (data) => {
      // Handle script output if needed
      console.log(data.toString());
    });

    child.stderr.on('data', (data) => {
      // Handle script error if needed
      console.error(data.toString());
    });

    child.on('error', (error) => {
      // Handle child process error if needed
      console.error(error);
      reject(error);
    });

    child.on('exit', (code) => {
      if (code === 0) {
        // Script executed successfully
        resolve();
      } else {
        // Script execution failed
        reject(new Error(`Script exited with code ${code}`));
      }
    });
  });
}

async function generateQRCode(pointId: number, body: any) {
  const filename = `qr_point_${pointId}.png`;
  const filepath = path.join(__dirname, '../../../../coupons', 'qr_codes', filename);
  console.log(filepath);
  
  //const logoPath = path.join(__dirname, '../../../../', './public/assets/logo.png'); // Path to the logo image file

  return new Promise<{ filepath: string }>((resolve, reject) => {
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
        resolve({ filepath });
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
      issuerId,
      initialAmount,
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
    const qrcodeBody = `${process.env.POINTS_URL!}/claim?code=${token}`
    const { filepath } = await generateQRCode(point.id, qrcodeBody);
    await generateCoupon(filepath);

    return { point }
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect()
  }
}
