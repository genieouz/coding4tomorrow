import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class ImageSizes {
  @Field(type => ID, { nullable: true })
  public sm: string;

  @Field(type => ID, { nullable: true })
  public md: string;

  @Field(type => ID, { nullable: true })
  public lg: string;
}
