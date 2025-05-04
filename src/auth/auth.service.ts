import { Dependencies, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
@Dependencies(UserService)

export class AuthService {
    constructor(private readonly userService: UserService) {
        ;
    }

    async validateUser(id: string) {
        const user = await this.userService.getUserById(id)
        return user
    }
    async loginWithEmail(email: string) {
        // const user=
    }
}
