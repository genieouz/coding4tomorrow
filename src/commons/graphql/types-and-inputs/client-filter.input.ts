import { IsOptional, Min } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { AnyObject } from '~/commons/typings/typescript';
import { Any } from '../scalars/any.scalar';
import { OrderByInput } from '~/commons/graphql/types-and-inputs/order-by.input';

@InputType()
export class ClientFilterInput {
  @Field(type => Int, { nullable: true })
  @Min(0)
  @IsOptional()
  public offset?: number;

  @Field(type => Int, { nullable: true })
  @Min(1)
  @IsOptional()
  public limit?: number;

  @Field(type => Any, { nullable: true })
  public filter?: AnyObject;

  @Field(type => String, { nullable: true })
  public search?: string;

  @Field(type => OrderByInput, { nullable: true })
  public orderBy?: OrderByInput;
}
