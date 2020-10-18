import { ApiProperty } from "@nestjs/swagger";
import { Field, InputType } from 'type-graphql';

@InputType()
export class LoginDto {
    @ApiProperty()
    @Field()
    email: string;

    @ApiProperty()
    @Field()
    password: string;

    role: string;
}