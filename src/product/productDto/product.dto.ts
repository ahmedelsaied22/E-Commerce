import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilteringProductDTO {
  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @IsOptional()
  maxPrice?: number;
}
