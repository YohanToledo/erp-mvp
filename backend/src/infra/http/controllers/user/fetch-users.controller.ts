import { z } from 'zod'

import { FetchUsersUseCase } from '@/domain/account/application/use-cases/fetch-users'
import { CurrentUser } from '@/infra/auth/authentication/current-user-decorator'
import { UserPayload } from '@/infra/auth/authentication/jwt.strategy'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ContentWithPaginationPresenter } from '../../presenters/content-whith-pagination.presenter'
import { UserPresenter } from '../../presenters/user.presenter'
import { PaginationQueryParamsSchema } from '../../validators/pagination-query.validator'

const UserQueryParamsSchema = PaginationQueryParamsSchema.extend({
  search: z.string().optional(),
})

type UserQueryParams = z.infer<typeof UserQueryParamsSchema>

const queryValidationPipe = new ZodValidationPipe(UserQueryParamsSchema)

@Controller('/users')
export class FetchUsersController {
  constructor(private fetchUsers: FetchUsersUseCase) { }

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(queryValidationPipe) query: UserQueryParams,
  ) {
    const subscriberId = user.subscriber
    const { page, limit, search } = query

    const result = await this.fetchUsers.execute({
      page,
      limit,
      filters: {
        subscriberId,
        search,
      },
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { users, totalElements } = result.value

    return ContentWithPaginationPresenter(
      users.map(UserPresenter.toHTTP),
      totalElements,
      page,
      limit,
    )
  }
}
