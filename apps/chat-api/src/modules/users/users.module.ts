import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "./domain/entities/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
