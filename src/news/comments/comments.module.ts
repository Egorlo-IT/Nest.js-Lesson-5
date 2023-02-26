import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsEntity } from './comments.entity';
import { UsersModule } from 'src/users/users.module';
import { NewsModule } from '../news.module';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports: [
    TypeOrmModule.forFeature([CommentsEntity]),
    UsersModule,
    forwardRef(() => NewsModule),
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
