import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  sayHello(): { message: string } {
    return { message: 'Hello World!!!!' };
  }
}
