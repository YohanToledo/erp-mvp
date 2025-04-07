import { Either, left, right } from '@/core/either'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { Injectable } from '@nestjs/common'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { UserRepository } from '../repositories/user.repository'
import { hash } from 'bcrypt'

interface AuthenticateUserUseCaseRequest {
  username: string,
  password: string
}

type AuthenticateUserUseCaseResponse = Either<WrongCredentialsError, { accessToken: string }>

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private userRepository: UserRepository,
    private readonly jwtEncrypter: JwtEncrypter,
  ) {}

  async execute(
    request: AuthenticateUserUseCaseRequest,
  ): Promise<AuthenticateUserUseCaseResponse> {
    const { username, password } = request

    const user = await this.userRepository.findByUsername(username)

    const hashPass = await hash(password, 10)

    if (!user || !user.active || user.password !== hashPass) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.jwtEncrypter.encrypt({
      sub: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      active: user.active,
    })

    return right({accessToken})
  }
}
