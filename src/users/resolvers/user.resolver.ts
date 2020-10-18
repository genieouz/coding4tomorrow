import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { User } from "~/users/dto/user.entity";
import { UserService } from "~/users/services/user.service";
import { IUser } from "~/users/models/interfaces/user.interface";
import { UserInput } from "~/users/dto/user.input";
import { UpdateUserInput } from "~/users/dto/update-user.input";
import { ID } from "type-graphql";
import { ClientFilterInput } from "~/commons/graphql/types-and-inputs/client-filter.input";


@Resolver()
export class UserResolver {
    constructor(
        private readonly userService: UserService
    ) { }

    @Mutation(returns => User)
    createUser(
        @Args({ name: 'userInput', type: () => UserInput }) userInput: UserInput,
    ): Promise<IUser> {
        return this.userService.insertOne(userInput);
    }

    @Mutation(returns => User)
    updateUser(
        @Args({ name: 'userId', type: () => ID }) userId: string,
        @Args({ name: 'userInput', type: () => UpdateUserInput }) userInput: UpdateUserInput,
    ): Promise<IUser> {
        return this.userService.updateOneById(userId, userInput);
    }

    @Query(returns => User)
    fetchUser(
        @Args({ name: 'userId', type: () => ID }) userId: string,
    ): Promise<IUser> {
        return this.userService.findOneByIdOrFail(userId);
    }

    @Query(returns => [User])
    fetchUsers(
        @Args({ name: 'clientFilter', type: () => ClientFilterInput }) clientFilter: ClientFilterInput,
    ): Promise<IUser[]> {
        return this.userService.find({}, clientFilter);
    }

    @Mutation(returns => Boolean)
    removeUser(
        @Args({ name: 'userId', type: () => ID }) userId: string,
    ): Promise<boolean> {
        return this.userService.removeOneByIdOrFail(userId);
    }
}
