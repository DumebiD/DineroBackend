import { Test, TestingModule } from '@nestjs/testing';
import { LedgerEntryController } from './ledger_entry.controller.js';
import { LedgerEntryService } from './ledger_entry.service.js';

describe('LedgerEntryController', () => {
  let controller: LedgerEntryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LedgerEntryController],
      providers: [LedgerEntryService],
    }).compile();

    controller = module.get<LedgerEntryController>(LedgerEntryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
