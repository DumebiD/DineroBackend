import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LedgerEntryService } from './ledger_entry.service.js';
import { CreateLedgerEntryDto } from './dto/create-ledger_entry.dto.js';
import { UpdateLedgerEntryDto } from './dto/update-ledger_entry.dto.js';

@Controller('ledger-entry')
export class LedgerEntryController {
  constructor(private readonly ledgerEntryService: LedgerEntryService) {}

  @Post()
  create(@Body() createLedgerEntryDto: CreateLedgerEntryDto) {
    return this.ledgerEntryService.create(createLedgerEntryDto);
  }

  @Get()
  findAll() {
    return this.ledgerEntryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ledgerEntryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLedgerEntryDto: UpdateLedgerEntryDto) {
    return this.ledgerEntryService.update(+id, updateLedgerEntryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ledgerEntryService.remove(+id);
  }
}
