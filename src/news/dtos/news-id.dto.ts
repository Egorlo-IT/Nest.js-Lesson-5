import { IsNotEmpty, IsString } from 'class-validator';
export class NewsIdDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
