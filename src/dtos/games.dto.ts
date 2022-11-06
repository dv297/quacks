import { IsString } from 'class-validator';

export class CreateGameDto {
  @IsString()
  public gameId: string;
}
