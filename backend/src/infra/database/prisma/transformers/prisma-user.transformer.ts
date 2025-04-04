import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/account/enterprise/entities/user'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaUserTransformer {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        subscriberId: raw.subscriberId,
        name: raw.name,
        email: raw.email,
        status: raw.status,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      subscriberId: user.subscriberId,
      name: user.name,
      email: user.email,
      status: user.status,
    }
  }

  static toPrismaUpdate(user: Partial<User>): Prisma.UserUpdateArgs {
    if (!user.id) {
      throw new Error('User ID is required to perform an update')
    }

    return {
      where: {
        id: user.id.toString(),
      },
      data: {
        name: user.name,
        email: user.email,
        status: user.status,
      },
    }
  }
}
