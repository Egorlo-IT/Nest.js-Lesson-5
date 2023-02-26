import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  Res,
  HttpStatus,
  HttpException,
  UseInterceptors,
  Render,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CommentsService } from './comments/comments.service';
import { NewsIdDto } from './dtos/news-id.dto';
import { NewsCreateDto } from './dtos/news-create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from '../utils/HelperFileLoader';
import { imageFileFilter } from '../utils/imageFileFilter';
import { MailService } from '../mail/mail.service';
import { NewsEntity } from './news.entity';
import { CategoriesService } from '../categories/categories.service';
import { UsersService } from '../users/users.service';

const PATH_NEWS = '/news-static/';
const helperFileLoader = new HelperFileLoader();
helperFileLoader.path = PATH_NEWS;

@Controller('news')
export class NewsController {
  constructor(
    private newsService: NewsService,
    private readonly commentService: CommentsService,
    private usersService: UsersService,
    private categoriesService: CategoriesService,
    private mailService: MailService,
  ) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @Body() news: NewsCreateDto,
    @UploadedFile() cover: Express.Multer.File,
  ) {
    try {
      const _user = await this.usersService.findById(news.authorId);
      if (!_user) {
        throw new HttpException(
          'Не существует такого автора',
          HttpStatus.BAD_REQUEST,
        );
      }
      const _category = await this.categoriesService.findById(news.categoryId);
      if (!_category) {
        throw new HttpException(
          'Не существует такой категории',
          HttpStatus.BAD_REQUEST,
        );
      }

      const _newsEntity = new NewsEntity();
      if (cover?.filename) {
        _newsEntity.cover = PATH_NEWS + cover.filename;
      }
      _newsEntity.title = news.title;
      _newsEntity.description = news.description;
      _newsEntity.user = _user;
      _newsEntity.category = _category;

      const _news = await this.newsService.create(_newsEntity);
      await this.mailService.sendNewNewsForAdmins(
        ['egorlo@mail.ru', 'egorlo059@gmail.com'],
        _news,
      );
      return _news;
    } catch (error) {
      console.log(error);
    }
  }

  @Post('edit')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async edit(
    @Query('idNews') idNews: string,
    @Body() news: NewsCreateDto,
    @UploadedFile() cover: Express.Multer.File,
  ) {
    try {
      const _newsPrevios = await this.newsService.findById(+idNews);
      console.log('_newsPrevios:', _newsPrevios);

      if (!_newsPrevios) {
        throw new HttpException(
          'Не существует такой новости',
          HttpStatus.BAD_REQUEST,
        );
      }

      const _user = await this.usersService.findById(news.authorId);
      if (!_user) {
        throw new HttpException(
          'Не существует такого автора',
          HttpStatus.BAD_REQUEST,
        );
      }
      const _category = await this.categoriesService.findById(news.categoryId);
      if (!_category) {
        throw new HttpException(
          'Не существует такой категории',
          HttpStatus.BAD_REQUEST,
        );
      }

      const _newsEntity = new NewsEntity();
      if (cover?.filename) {
        _newsEntity.cover = PATH_NEWS + cover.filename;
      }
      _newsEntity.title = news.title;
      _newsEntity.description = news.description;
      _newsEntity.user = _user;
      _newsEntity.category = _category;

      const _newsNew = await this.newsService.edit(_newsEntity, +idNews);
      // await this.mailService.sendEditNewsForAdmins(
      //   ['egorlo@mail.ru', 'egorlo059@gmail.com'],
      //   _newsNew,
      //   _newsPrevios,
      // );
      return _newsNew;
    } catch (error) {
      console.log(error);
    }
  }

  @Delete(':id')
  async delete(@Param() params: NewsIdDto): Promise<boolean> {
    return this.newsService.remove(+params.id);
    // &&
    // this.commentService.removeAll(params.id)
  }

  @Get()
  @Render('news-list')
  async getViewAll(): Promise<{ news: NewsEntity[] }> {
    const news = await this.newsService.findAll();
    console.log('news:', news);
    return news;
  }

  @Get(':id/detail')
  @Render('news-details')
  async getByIdDetail(@Param() params: NewsIdDto) {
    const news = await this.newsService.findById(+params.id);
    const comments = await this.commentService.findAll(+params.id);
    console.log(comments);
    return { news, comments };
  }
}
