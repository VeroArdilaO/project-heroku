import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';

@Controller('pet')
export class PetController {
  @Get('axios')
  public async getTask(@Res() response: Response) {
    //const data = await this.knex('test').select('*');
    const requestPets = await axios.get('https://bsl1.herokuapp.com/pet');
    const pets = requestPets.data;
    console.log(requestPets);
    const requestCategories = await axios.get(
      'https://bsl1.herokuapp.com/pet/categories',
    );
    const categorias = requestCategories.data.categories;
    const petsWithCatName = pets.map((pet) => {
      delete pet.id;
      pet.category = categorias.find(
        (category) => category.id === pet.category,
      ).name;
      return pet;
    });
    //Logger.log({ data });
    return response.status(HttpStatus.OK).send({ petsWithCatName });
  }
}

//url a llamar http://localhost:3000/pet/axios
