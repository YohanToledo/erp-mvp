import { Either, left, right } from '@/core/either'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { EnvService } from '@/infra/env/env.service'
import { MailService } from '@/infra/mail/mail.service'
import { Injectable } from '@nestjs/common'

import { SubscriberRepository } from '../repositories/subscriber.repository'
import { UserRepository } from '../repositories/user.repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { SubscriberDisabledError } from './errors/subscriber-disabled-error'
import { Status } from '@prisma/client'
import { SubscriptionRepository } from '@/domain/subscription/application/repositories/subscription.repository'

interface AuthenticateUserUseCaseRequest {
  email: string
}

type AuthenticateUserUseCaseResponse = Either<WrongCredentialsError, null>

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private userRepository: UserRepository,
    private subscriberRepository: SubscriberRepository,
    private readonly jwtEncrypter: JwtEncrypter,
    private readonly envService: EnvService,
    private readonly mailService: MailService,
    private subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(
    request: AuthenticateUserUseCaseRequest,
  ): Promise<AuthenticateUserUseCaseResponse> {
    const { email } = request

    const user = await this.userRepository.findByEmail(email)

    if (!user || user.status === 'DISABLED') {
      return left(new WrongCredentialsError())
    }

    const subscriber = await this.subscriberRepository.findById(
      user.subscriberId,
    )

    if (subscriber?.status === Status.DISABLED) {
      return left(new SubscriberDisabledError())
    }

    const isValidSubscription =
      await this.subscriptionRepository.isValidSubscription(user.subscriberId)

    if (!isValidSubscription) {
      return left(new SubscriberDisabledError())
    }

    const accessToken = await this.jwtEncrypter.encrypt({
      sub: user.id.toString(),
      name: user.name,
      subscriber: user.subscriberId.toString(),
      subscriberType: subscriber?.type,
      subscriberName: subscriber?.name,
      repository: {
        id: subscriber?.repository.id,
        path: subscriber?.repository.path,
      },
    })

    const magicLink = `${this.envService.get(
      'PORTAL_URL',
    )}?token=${accessToken}`

    await this.mailService.sendMail({
      to: email,
      subject: 'Login Plataforma Nexaro',
      template: 'sign-in',
      context: {
        email,
        link: magicLink,
      },
    })

    return right(null)
  }
}
