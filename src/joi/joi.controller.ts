import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as Joi from 'joi';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Knex from 'knex';
import { NestjsKnexService } from 'nestjs-knexjs';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from 'src/auth.guard';
import * as moment from 'moment';
import * as jwt from 'jwt-simple';
import { AuthGuardToken } from 'src/authtoken.guard';

const SUPER_SECRET_KEY = 'clave super secreta';

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

const schemaLogin = Joi.object({
  password: Joi.string()
    .pattern(
      new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'),
    )
    .required(),
  email: Joi.string().required(),
});

@Controller('joi')
export class JoiController {
  private readonly knex: Knex = null;

  constructor(private nestjsKnexService: NestjsKnexService) {
    this.knex = this.nestjsKnexService.getKnexConnection();
  }
  pets: any = [
    {
      id: 1,
      name: 'Kira',
      /* en este caso category es una clave foránea a la entidad categoria */
      category: 1,
    },
    {
      id: 2,
      name: 'Maison Mount',
      category: 2,
    },
    {
      id: 3,
      name: 'Rex',
      category: 1,
    },
    {
      id: 4,
      name: 'Machi',
      category: 2,
    },
    {
      id: 5,
      name: 'Rin tin tin',
      category: 1,
    },
    {
      id: 6,
      name: 'Toby',
      category: 1,
    },
  ];

  @Get('pets')
  @UseGuards(new AuthGuard())
  public async getGuard(@Res() response: Response) {
    const data = this.pets;
    //Logger.log({ data, pets });
    return response.status(HttpStatus.OK).send(data);
  }

  @Get('tokenGuard')
  @UseGuards(new AuthGuardToken())
  public async tokenGuard(@Res() response: Response) {
    const data = this.pets;
    //Logger.log({ data, pets });
    return response.status(HttpStatus.OK).send(data);
  }

  @Get()
  public async get(@Res() response: Response) {
    let newData;

    try {
      newData = await this.knex('data').select('*');
    } catch (ex) {
      Logger.error(ex.message);
    }
    /* Logger.log({ data }); */
    return response.status(HttpStatus.OK).send({ newData });
  }
  @Post('tokenLogin')
  public async tokenLogin(@Res() response: Response, @Body() body: any) {
    try {
      console.log(body);
      const result = schemaLogin.validate(body);
      if (result.error) {
        return response.status(HttpStatus.BAD_REQUEST).send({
          error: result.error,
        });
      }
      const queryResult = await this.knex('data').where({ email: body.email });
      console.log(queryResult);
      if (!queryResult.length) {
        return response.status(HttpStatus.BAD_REQUEST).send({
          error: 'user or password invalid',
        });
      }
      const user = queryResult[0];
      const isValidPassword = bcrypt.compareSync(body.password, user.password);
      if (!isValidPassword) {
        return response.status(HttpStatus.BAD_REQUEST).send({
          error: 'email or password invalid',
        });
      }
      const token = this.createToken(user);
      user.token = token;
      const queryLastConnection = await this.knex('connection').where({
        user_id: user.id,
      });
      console.log({ queryLastConnection });
      user.lastConnection = !queryLastConnection.length
        ? 'Hola por primera vez'
        : queryLastConnection[0].last_connection;

      const newConnection = {
        user_id: user.id,
        last_connection: 'hoy',
      };
      const updateResult = await this.knex('connection')
        .update(newConnection)
        .where({
          user_id: user.id,
        });
      console.log({ updateResult });

      delete user.password;

      return response.status(HttpStatus.OK).send({
        user,
      });
    } finally {
    }
  }
  private createToken(user) {
    const payload = {
      email: user.email,
      mensajePlay: 'holi',
      sub: user.id,
      iat: moment().unix(),
      exp: moment().add(1, 'minute').unix(),
    };
    return jwt.encode(payload, SUPER_SECRET_KEY);
  }

  @Post('login')
  public async login(@Res() response: Response, @Body() body: any) {
    try {
      console.log(body);
      const result = schemaLogin.validate(body);
      if (result.error) {
        return response.status(HttpStatus.BAD_REQUEST).send({
          error: result.error,
        });
      }
      const queryResult = await this.knex('data').where({ email: body.email });
      console.log(queryResult);
      if (!queryResult.length) {
        return response.status(HttpStatus.BAD_REQUEST).send({
          error: 'user or password invalid',
        });
      }
      const user = queryResult[0];
      const isValidPassword = bcrypt.compareSync(body.password, user.password);
      if (!isValidPassword) {
        return response.status(HttpStatus.BAD_REQUEST).send({
          error: 'email or password invalid',
        });
      }
      /*const token = this.createToken(user); */
      const token = 'NestJS';
      user.token = token;
      const queryLastConnection = await this.knex('connection').where({
        user_id: user.id,
      });
      console.log({ queryLastConnection });
      user.lastConnection = !queryLastConnection.length
        ? 'Hola por primera vez'
        : queryLastConnection[0].last_connection;

      const newConnection = {
        user_id: user.id,
        last_connection: 'hoy',
      };
      const updateResult = await this.knex('connection')
        .update(newConnection)
        .where({
          user_id: user.id,
        });
      console.log({ updateResult });

      delete user.password;

      return response.status(HttpStatus.OK).send({
        user,
      });
    } finally {
    }
  }
  /*   private createToken(user) {
    const payload = {
      email: user.email,
      mensajePlay: 'holi',
      sub: user.id,
      iat: moment().unix(),
      exp: moment().add(20, 'second').unix(),
    };
    return jwt.encode(payload, SUPER_SECRET_KEY);
  }
 */
  @Post('axios')
  public async Post(@Res() response: Response, @Body() body: any) {
    try {
      const result = schema.validate(body);
      if (result.error) {
        return response.status(HttpStatus.BAD_REQUEST).send({
          error: result.error,
        });
      }
      const password = body.password;
      const saltRounds = 2;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const id = uuidv4();
      const table = {
        id,
        name: body.name,
        lastName: body.lastName,
        email: body.email,
        password: hashedPassword,
        gender: body.gender,
        birthDate: body.birthDate,
      };
      console.log(table);
      await this.knex(' data ').insert(table);
      Logger.log(table);
      return response.status(HttpStatus.CREATED).send({ table });
    } catch (ex) {
      Logger.error(ex.message);
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: 'ex.message' });
    } finally {
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

/* {
  "email": "Leito@gmail.com",
   "password": "Dbc1234&yuy"
  }
   
} */
/* {
  "email": "Pepe@gmail.com",
  "password": "Cbc1234&yuy"
  } */

/* {
  "name": "Camila",
  "lastName": "Perez",
  "email": "camili@gmail.com",
  "password": "Daa1234&yuy",
  "gender": "female",
  "birthDate": "1995-08-24T14:15:22Z"
} */
/* 
{
  "name": "Daniela",
  "lastName": "Gomez",
  "email": "Dani@gmail.com",
  "password": "Dcc1234&yuy",
  "gender": "female",
  "birthDate": "1995-08-24T14:15:22Z"
} */
