import { Module } from '@nestjs/common';
import { RuleService } from './rule.service.js';
import { RuleController } from './rule.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from './entities/rule.entity.js';

@Module({
  controllers: [RuleController],
  imports: [TypeOrmModule.forFeature([Rule])],
  providers: [RuleService],
})
export class RuleModule {}
