import { IsNotEmpty, IsString } from 'class-validator';
export class CommentEditDto {
  @IsNotEmpty()
  @IsString()
  message: string;
}
