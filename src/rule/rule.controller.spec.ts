import { Test, TestingModule } from '@nestjs/testing';
import { RuleController } from './rule.controller.js';
import { RuleService } from './rule.service.js';

describe('RuleController', () => {
  let controller: RuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RuleController],
      providers: [RuleService],
    }).compile();

    controller = module.get<RuleController>(RuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
