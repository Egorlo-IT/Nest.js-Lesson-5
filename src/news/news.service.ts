import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
  ) {}

  async create(news: NewsEntity) {
    return await this.newsRepository.save(news);
  }

  async findAll(userId?: number): Promise<{ news: NewsEntity[] }> {
    const data = await this.newsRepository
      .find({
        relations: ['user', 'category'],
      })
      .then((result) => {
        if (userId) {
          const filterData = result.filter((item) => +item.user.id === +userId);
          return filterData;
        }
        return result;
      });
    return { news: data };
  }

  async edit(news: NewsEntity, idNews: number) {
    console.log(news, idNews);

    const data = await this.newsRepository.update(idNews, news);
    console.log('data:', data);

    return data;
  }

  async findById(id: number): Promise<NewsEntity> {
    const data = await this.newsRepository.find({
      where: {
        id: id,
      },
      relations: ['user', 'category'],
    });

    return data[0];
  }

  async remove(id: number) {
    const _news = await this.findById(id);
    console.log('_news:', _news);

    if (_news) {
      await this.newsRepository.remove(_news);
      return true;
    }
    return false;
  }
}
