import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import * as Joi from 'joi';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Knex from 'knex';
import { NestjsKnexService } from 'nestjs-knexjs';

/* enum gender {
  male = 'male',
  female = 'female',
} */

const schema = Joi.object({
  name: Joi.string().required(),

  lastName: Joi.string().required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com'] },
    })
    .required(),

  password: Joi.string()
    .pattern(
      new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'),
    )
    .required(),

  gender: Joi.string().valid('male', 'female'),

  birthDate: Joi.string(),
});

@Controller('joi')
export class JoiController {
  private readonly knex: Knex = null;

  constructor(private nestjsKnexService: NestjsKnexService) {
    this.knex = this.nestjsKnexService.getKnexConnection();
  }
  @Get()
  public async get(@Res() response: Response) {
    let data;

    try {
      data = await this.knex('newData').select('*');
    } catch (ex) {
      Logger.error(ex.message);
    }
    /* Logger.log({ data }); */
    return response.status(HttpStatus.OK).send({ data });
  }

  @Post('axios')
  public async postAxios(@Res() response: Response, @Body() body: any) {
    try {
      const result = schema.validate(body);
      if (result.error) {
        return response.status(HttpStatus.BAD_REQUEST).send({
          error: result.error,
        });
      } /* 
      const id = uuidv4(); */
      const data = await this.knex('newData').insert({
        name: body.name,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        gender: body.gender,
        birthDate: body.birthDate,
      });
      Logger.log(data);
      return response.status(HttpStatus.CREATED).send({ data });
    } catch (ex) {
      Logger.error(ex.message);
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: 'Server error' });
    }
  }
  @Post('schema')
  public post(@Body() body: any, @Res() response: Response) {
    try {
      const result = schema.validate(body);
      console.log(body);
      /*   Logger.log({ result }); */
      if (result.error) {
        return response.status(HttpStatus.BAD_REQUEST).send({
          error: 'Invalid request body',
        });
      }
      const newUser = {
        ...body,
        id: uuidv4(),
        creationDate: new Date().getTime(),
        verifiedEmail: false,
      };
      return response.status(HttpStatus.CREATED).send({ newUser });
    } finally {
    }
  }
}
