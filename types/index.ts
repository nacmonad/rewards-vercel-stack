import { UserRole } from "@prisma/client"

export type Issuer = {
    id: number
    roleId: number
    role: UserRole
}

export type CreatePointArgs = {
    initialAmount: number
    issuerId: number
    promotionId?: number
    productId?: number
}

export type CreateRedemptionArgs = {
    userId: number
    amount: number
}

export type JWTCodeTokenPayload = {
    initialAmount: number
    currentAmount: number
    issuerId: number
    promotionId?: number
    productId?: number
  }