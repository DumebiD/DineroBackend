import { Controller, Get, Post, Body, Patch, Put, Param, Delete, ParseUUIDPipe, UseInterceptors } from '@nestjs/common';
import { RuleService } from './rule.service.js';
import { CreateRuleDto } from './dto/create-rule.dto.js';
import { UpdateRuleDto } from './dto/update-rule.dto.js';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor.js';

@Controller('rule')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  create(@Body() createRuleDto: CreateRuleDto) {
    return this.ruleService.create(createRuleDto);
  }

  @Get()
  findAll() {
    return this.ruleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ruleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto) {
    return this.ruleService.update(+id, updateRuleDto);
  }

  @UseInterceptors(LoggingInterceptor)
  @Put(':id')
  // update or insert based on id
  upsert(@Param('id', ParseUUIDPipe) id: string, @Body() createRuleDto: CreateRuleDto) {
    console.log("dto", createRuleDto)
    return this.ruleService.upsert(id, createRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ruleService.remove(+id);
  }
}
