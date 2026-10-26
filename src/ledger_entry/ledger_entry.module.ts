import { Module } from '@nestjs/common';
import { LedgerEntryService } from './ledger_entry.service.js';
import { LedgerEntryController } from './ledger_entry.controller.js';

@Module({
  controllers: [LedgerEntryController],
  providers: [LedgerEntryService],
})
export class LedgerEntryModule {}
