import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    if (!request.headers.bearer) {
      return true;
    }

    /*    const token = request.headers.bearer.split(' ')[1];

    try {
      const payload = jwt.decode(token, SEPER_SECRE_KEY);
      console.log(payload);
    } catch (ex) {
      Logger.error(ex.message);
      return false;
    } */

    console.log({
      request,
      response,
    });
    return true;
  }
}
