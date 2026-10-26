import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rule, RuleAction, RuleStatus, TransactionType } from '../rule/entities/rule.entity.js';
import { TxContext, ruleMatches, computeFee } from '../rule/rule_evaluator.js';

export interface FeeResult {
  fee: number;
  ruleId: string;
  ruleName: string;
}

@Injectable()
export class FeeService {
  constructor(
    @InjectRepository(Rule) private readonly rules: Repository<Rule>,
  ) {}

  async calculateFee(
    transactionType: TransactionType,
    ctx: TxContext,
  ): Promise<FeeResult> {
    // 1. Cheap DB filter on real columns, already sorted by priority
    const candidates = await this.rules.find({
      where: { active: true, transactionType },
      order: { priority: 'ASC' },
    });

    // 2. First rule whose JSON conditions match the transaction wins
    const rule = candidates.find((r) => ruleMatches(r, ctx));
    if (!rule) {
      throw new NotFoundException('No fee rule matches this transaction');
    }

    // 3. Compute the fee (a Waive rule means no charge)
    const fee = rule.action === RuleAction.Waive ? 0 : computeFee(rule, ctx.amount);

    return { fee, ruleId: rule.id, ruleName: rule.name };
  }
}