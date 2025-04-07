import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

import { User } from '../../enterprise/entities/user'
import { UserRepository } from '../repositories/user.repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface CreateUserUseCaseRequest {
  name: string
  username: string
  password: string
  email?: string
  active?: boolean
}

type CreateUserUseCaseResponse = Either<UserAlreadyExistsError, { user: User }>

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    request: CreateUserUseCaseRequest,
  ): Promise<CreateUserUseCaseResponse> {
    const { name, username, email, password, active = true } = request

    const userWithSameUsername = await this.userRepository.findByUsername(username)

    if (userWithSameUsername) {
      return left(new UserAlreadyExistsError(username))
    }

    const user = User.create({
      name,
      username,
      email: email || null,
      password,
      active,
    })

    await this.userRepository.create(user)

    return right({ user })
  }
}
