import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateGroupDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    universityId: number;
}