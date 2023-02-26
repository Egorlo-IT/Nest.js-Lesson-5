import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}
  // Возвращаемое значение может быть Promise<UsersEntity|undefined>
  // Озвучить устно, что необходимо отработать крайний случай на уровне выше,если запись не произошла
  async create(user) {
    const userEntity = new UsersEntity();
    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;
    userEntity.email = user.email;
    userEntity.role = user.role;
    return await this.usersRepository.save(userEntity);
  }

  async findById(id: number): Promise<UsersEntity> {
    const data = await this.usersRepository.find({
      where: {
        id: id,
      },
    });

    console.log('data:', data);

    return data[0];
  }
}
