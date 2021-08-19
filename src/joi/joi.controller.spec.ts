import { Test, TestingModule } from '@nestjs/testing';
import { JoiController } from './joi.controller';

describe('JoiController', () => {
  let controller: JoiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JoiController],
    }).compile();

    controller = module.get<JoiController>(JoiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
