import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { NewsEntity } from '../news/news.entity';
@Entity('categories')
export class CategoriesEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('text')
  name: string;
  @OneToMany(() => NewsEntity, (news) => news.category)
  news: NewsEntity[];
}
