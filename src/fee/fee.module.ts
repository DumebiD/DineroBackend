import { Module } from '@nestjs/common';
import { FeeService } from './fee.service.js';
import { FeeController } from './fee.controller.js';
import { RuleModule } from '../rule/rule.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from '../rule/entities/rule.entity.js';

@Module({
  controllers: [FeeController],
  imports: [TypeOrmModule.forFeature([Rule])],
  providers: [FeeService],
})
export class FeeModule {}
