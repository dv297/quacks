import { IsString, IsObject } from 'class-validator';

export class CreateGameDto {
  @IsString()
  public gameId: string;

  @IsObject()
  public players: object;
}
