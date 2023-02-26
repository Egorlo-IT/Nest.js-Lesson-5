import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
export class NewsEditDto {
  @IsNotEmpty()
  @IsString()
  id: string;
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @ValidateIf((o) => o.cover)
  @IsString()
  cover: string;
  @IsNotEmpty()
  @IsString()
  authorId: number;
  @IsNotEmpty()
  @IsString()
  categoryId: number;
  @ValidateIf((o) => o.comment)
  @IsString()
  commentId: string;
}
