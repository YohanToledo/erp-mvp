
import { Module } from '@nestjs/common'
import { CreateUserController } from './controllers/user/create-user.controller'
import { DeleteUserController } from './controllers/user/delete-user.controller'
import { FetchUserController } from './controllers/user/fetch-user.controller'
import { FetchUsersController } from './controllers/user/fetch-users.controller'
import { UpdateUserController } from './controllers/user/update-user.controller'
import { EnvModule } from '../env/env.module'
import { CacheModule } from '@nestjs/cache-manager'
import { AuthModule } from '../auth/auth.module'
import { AuthenticateUseCase } from '@/domain/account/application/use-cases/authenticate'
import { ValidateTokenUseCase } from '@/domain/account/application/use-cases/validate-token'
import { FetchUsersUseCase } from '@/domain/account/application/use-cases/fetch-users'
import { FetchUserUseCase } from '@/domain/account/application/use-cases/fetch-user'
import { CreateUserUseCase } from '@/domain/account/application/use-cases/create-user'
import { UpdateUserUseCase } from '@/domain/account/application/use-cases/update-user'
import { DeleteUserUseCase } from '@/domain/account/application/use-cases/delete-user'

@Module({
  imports: [
    EnvModule,
    AuthModule,
    CacheModule.register({
      ttl: 5000,
      max: 10,
    }),
  ],
  controllers: [
    FetchUsersController,
    FetchUserController,
    CreateUserController,
    UpdateUserController,
    DeleteUserController,
    UpdateUserController,
  ],
  providers: [
    AuthenticateUseCase,
    ValidateTokenUseCase,
    FetchUsersUseCase,
    FetchUserUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class HttpModule {}
