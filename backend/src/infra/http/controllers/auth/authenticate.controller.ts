import { z } from 'zod'

import { AuthenticateUseCase } from '@/domain/account/application/use-cases/authenticate'
import { WrongCredentialsError } from '@/domain/account/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/authentication/public'
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { SubscriberDisabledError } from '@/domain/account/application/use-cases/errors/subscriber-disabled-error'

const authenticateBodySchema = z.object({
  email: z.string().email(),
})

const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema)

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticate: AuthenticateUseCase) {}

  @Post()
  @HttpCode(204)
  async handle(@Body(bodyValidationPipe) body: AuthenticateBodySchema) {
    const { email } = body

    const result = await this.authenticate.execute({
      email,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        case SubscriberDisabledError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
