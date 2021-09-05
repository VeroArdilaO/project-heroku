import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { NestjsKnexService } from 'nestjs-knexjs';
import { comparePassword } from './auth.helpers';
import { User } from '../models/user';
import Knex from 'knex';

/**
 * Class local strategy
 *
 * @export
 * @class LocalStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  private readonly knex: Knex = null;
  constructor(private readonly nestjsKnexService: NestjsKnexService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: false,
    });
    this.knex = this.nestjsKnexService.getKnexConnection();
  }

  /**
   * Validate account
   *
   * @param {String} email
   * @param {String} password
   * @memberof LocalStrategy
   */
  async validate(email: string, password: string): Promise<User> {
    const queryResult = await this.knex('data').where({ email });
    if (
      !queryResult ||
      !queryResult[0] ||
      !comparePassword(password, queryResult[0].password)
    ) {
      throw new UnauthorizedException();
    }
    return queryResult[0];
  }
}
