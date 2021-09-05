import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export enum UserGender {
  Male = 'male',
  Female = 'female',
}

export class User {
  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'Email' })
  @IsEmail(
    {},
    {
      message: 'The email is not valid',
    },
  )
  @IsNotEmpty({
    message: 'Email is required',
  })
  email: string;

  @ApiProperty({ description: 'first name' })
  @IsNotEmpty({
    message: 'First name is required',
  })
  name: string;

  @ApiProperty({ description: 'Last name' })
  @IsNotEmpty({
    message: 'Last name is required',
  })
  lastName: string;

  @ApiProperty({ description: 'Birthday' })
  @IsNotEmpty({
    message: 'Date of birth is required',
  })
  birthDate?: Date;

  @ApiProperty({ description: 'Password' })
  password?: string;

  @ApiProperty({ description: 'Status' })
  @IsNotEmpty({
    message: 'The user status is required',
  })
  gender: UserGender;
}

export class UserPasswords {
  @ApiProperty({ description: 'User password' })
  @IsNotEmpty({
    message: 'The password is required',
  })
  password: string;

  @ApiProperty({ description: 'Repeat user password' })
  @IsNotEmpty({
    message: 'Repeat password is required',
  })
  repeatPassword: string;
}
