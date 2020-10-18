import { ApiProperty } from "@nestjs/swagger";
import { Field, InputType } from 'type-graphql';

@InputType()
export class RegisterDto {
    @ApiProperty()
    @Field()
    public phoneNumber: string;

    @ApiProperty()
    @Field()
    public lastName: string;

    @ApiProperty()
    @Field()
    public firstName: string;

    @ApiProperty()
    @Field()
    public password: string;

    @ApiProperty()
    @Field()
    public email: string;

    @Field(type => Date)
    public birthDate: Date;

    @Field()
    public gender: string;

    @Field()
    public city: string;

    @Field()
    public district: string;

    role: string;
}