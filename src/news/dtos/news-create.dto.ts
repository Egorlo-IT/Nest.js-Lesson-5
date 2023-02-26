import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
export class NewsCreateDto {
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
}
