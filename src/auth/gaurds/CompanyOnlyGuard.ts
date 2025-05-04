import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class CompanyOnlyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user?.ownerType !== 'company') {
            throw new ForbiddenException('Only companies are allowed to perform this action');
        }

        return true;
    }
}
