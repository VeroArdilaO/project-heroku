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
  @Get()
  public get(@Res() response: Response) {
    return response.status(HttpStatus.OK).send({});
  }
  @Post()
  public post(@Body() body: any, @Res() response: Response) {
    try {
      const result = schema.validate(body);
      console.log(body);
      Logger.log({ result });
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
