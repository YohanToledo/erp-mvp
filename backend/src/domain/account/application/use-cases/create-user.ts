import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

import { User } from '../../enterprise/entities/user'
import { UserRepository } from '../repositories/user.repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface CreateUserUseCaseRequest {
  subscriberId: string
  name: string
  email: string
  status: string
}

type CreateUserUseCaseResponse = Either<UserAlreadyExistsError, { user: User }>

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    request: CreateUserUseCaseRequest,
  ): Promise<CreateUserUseCaseResponse> {
    const { subscriberId, name, email, status } = request

    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const user = User.create({
      subscriberId,
      name,
      email,
      status,
    })

    await this.userRepository.create(user)

    return right({
      user,
    })
  }
}
