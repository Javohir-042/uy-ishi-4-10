import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStudentDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsNumber()
    @IsOptional()
    age: number;

    @IsNumber()
    @IsNotEmpty()
    groupId: number;
}
