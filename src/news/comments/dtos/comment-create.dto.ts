import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
export class CommentCreateDto {
  @IsNotEmpty()
  @IsString()
  message: string;
  @ValidateIf((o) => o.avatar)
  @IsString()
  avatar: string;
  @IsNotEmpty()
  @IsString()
  authorId: number;
}
