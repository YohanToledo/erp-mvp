import { z } from 'zod'

import { CreateUserUseCase } from '@/domain/account/application/use-cases/create-user'
import { CurrentUser } from '@/infra/auth/authentication/current-user-decorator'
import { UserPayload } from '@/infra/auth/authentication/jwt.strategy'
import { Body, Controller, HttpCode, Post } from '@nestjs/common'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { UserPresenter } from '../../presenters/user.presenter'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  status: z.enum(['ACTIVED', 'DISABLED']),
})

const bodyValidationPipe = new ZodValidationPipe(createAccountBodySchema)

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('users')
export class CreateUserController {
  constructor(private userCustomer: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateAccountBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, email, status } = body

    const result = await this.userCustomer.execute({
      subscriberId: user.subscriber,
      name,
      email,
      status,
    })

    if (result.isLeft()) {
      const error = result.value
      throw error.toHttpException()
    }

    const { user: createdUser } = result.value

    return UserPresenter.toHTTP(createdUser)
  }
}
