import { InputType, Field } from 'type-graphql';

@InputType()
export class UpdatePasswordDto {
    @Field()
    password: string;

    @Field()
    resetToken: string;

    @Field()
    resetCode: number;
}