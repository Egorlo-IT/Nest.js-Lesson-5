import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsEntity } from './comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
  ) {}

  async findAll(id: number): Promise<CommentsEntity[]> {
    console.log('id:', id);
    const data = await this.commentsRepository
      .find({
        relations: ['user', 'news'],
      })
      .then((result) => {
        const filterData = result.filter((item) => item.news.id === id);
        return filterData;
      });
    return data;
  }

  async findById(id: number): Promise<CommentsEntity> {
    const data = await this.commentsRepository.find({
      where: {
        id: id,
      },
      relations: ['user', 'news'],
    });
    return data[0];
  }

  async create(comment: CommentsEntity) {
    return await this.commentsRepository.save(comment);
  }

  async remove(id: number) {
    const _comment = await this.findById(id);
    if (_comment) {
      await this.commentsRepository.remove(_comment);
      return true;
    }
    return false;
  }
  async edit(comment: CommentsEntity, idComment: number) {
    return await this.commentsRepository.update(idComment, comment);
  }
}
