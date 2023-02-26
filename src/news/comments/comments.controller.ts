import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentIdDto } from './dtos/comment-id.dto';
import { CommentCreateDto } from './dtos/comment-create.dto';
import { CommentEditDto } from './dtos/comment-edit.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from '../../utils/helperFileLoader';
import { imageFileFilter } from 'src/utils/imageFileFilter';
import { UsersService } from 'src/users/users.service';
import { CommentsEntity } from './comments.entity';
import { NewsService } from '../news.service';

const PATH_COMMENTS = '/comments-static/';
const helperFileLoader = new HelperFileLoader();
helperFileLoader.path = PATH_COMMENTS;

@Controller('news-comments')
export class CommentsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
    private usersService: UsersService,
  ) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @Query('idNews') idNews: string,
    @Body() comment: CommentCreateDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    try {
      console.log('comment.authorId:', comment.authorId);

      const _user = await this.usersService.findById(comment.authorId);

      console.log('_user:', _user);

      if (!_user) {
        throw new HttpException(
          'Не существует такого автора',
          HttpStatus.BAD_REQUEST,
        );
      }
      const _news = await this.newsService.findById(+idNews);

      if (!_news) {
        throw new HttpException(
          'Не существует такой категории',
          HttpStatus.BAD_REQUEST,
        );
      }
      const _commentsEntity = new CommentsEntity();

      if (avatar?.filename) {
        _commentsEntity.avatar = PATH_COMMENTS + avatar.filename;
      }

      _commentsEntity.message = comment.message;
      _commentsEntity.user = _user;
      _commentsEntity.news = _news;

      const _comment = await this.commentsService.create(_commentsEntity);
      return _comment;
    } catch (error) {
      console.log(error);
    }
  }

  @Post('edit')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async edit(
    @Query('idComment') idComment: string,
    @Body() comment: CommentEditDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const _commentPrevios = await this.commentsService.findById(+idComment);

    if (!_commentPrevios) {
      throw new HttpException(
        'Не существует такого комментария',
        HttpStatus.BAD_REQUEST,
      );
    }
    const _commentsEntity = new CommentsEntity();

    if (avatar?.filename) {
      _commentsEntity.avatar = PATH_COMMENTS + avatar.filename;
    }
    _commentsEntity.message = comment.message;

    const _commentNew = await this.commentsService.edit(
      _commentsEntity,
      +idComment,
    );

    return _commentNew;
  }

  @Delete(':id')
  async remove(@Param() params: CommentIdDto): Promise<boolean> {
    return this.commentsService.remove(+params.id);
  }
}
