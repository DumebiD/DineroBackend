import { Injectable } from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto.js';
import { UpdateRuleDto } from './dto/update-rule.dto.js';
import { Rule, RuleConditions } from './entities/rule.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(Rule) private readonly ruleRepo: Repository<Rule>,
  ) { }

  create(createRuleDto: CreateRuleDto) {
    return 'This action adds a new rule';
  }

  findAll() {
    return this.ruleRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} rule`;
  }

  update(id: number, updateRuleDto: UpdateRuleDto) {
    return `This action updates a #${id} rule`;
  }

  async upsert(id: string, createRuleDto: CreateRuleDto) {
    // the frontend gives id as a uuid
    const { conditions, ...rest } = createRuleDto;

    const ruleEntity = this.ruleRepo.create({
      ...rest,
      id,
      ...(conditions && { conditions: conditions as RuleConditions }),
    });

    return await this.ruleRepo.save(ruleEntity)
  }

  remove(id: number) {
    return `This action removes a #${id} rule`;
  }
}
