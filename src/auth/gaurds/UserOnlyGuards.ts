import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class UseronlyGaurds implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user?.ownerType !== 'user') {
            throw new ForbiddenException('Only user are allowed to perform this action');
        }

        return true;
    }
}
