import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';

@Controller('pet')
export class PetController {
  @Get('axios')
  public async get(@Res() response: Response) {
    const requestPets = await axios.get('https://bsl1.herokuapp.com/pet');
    const pets = requestPets.data.pets;
    const requestCategories = await axios.get(
      'https://bsl1.herokuapp.com/pet/categories',
    );
    const categories = requestCategories.data.categories;
    const mixPets = pets.map((pet) => {
      delete pets.id;
      pet.category = categories.find(
        (category) => category.id === pet.category,
      ).name;
      return pet;
    });
    return response.status(HttpStatus.OK).send({ mixPets });
  }
}
