import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTeacherDto {
    
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsOptional()
    specialization: string;
    
    @IsNumber()
    @IsNotEmpty()
    universityId: number;
}
