import { Condition, Rule } from "./entities/rule.entity.js";

export interface TxContext {
  amount: number;
  channel: string;
  destination_type: string;
}

function checkCondition(c: Condition, ctx: TxContext): boolean {
  const actual = ctx[c.field];

  switch (c.op) {
    case 'equals':     return actual === c.value;
    case 'not_equals': return actual !== c.value;
    case 'in':         return (c.value as string[]).includes(actual as string);
    case 'gt':         return (actual as number) > (c.value as number);
    case 'lt':         return (actual as number) < (c.value as number);
    case 'between': {
      const [lo, hi] = c.value as [number, number];
      return (actual as number) >= lo && (actual as number) <= hi;
    }
    default:
      throw new Error(`Unknown operator`);
  }
}

export function ruleMatches(rule: Rule, ctx: TxContext): boolean {
  return rule.conditions.all.every(c => checkCondition(c, ctx));
}

export function computeFee(rule: Rule, amount: number): number {
  let fee = rule.flatAmount + (amount * rule.percent) / 100;
  if (rule.minFee != null) fee = Math.max(fee, rule.minFee);
  if (rule.maxFee != null) fee = Math.min(fee, rule.maxFee);
  return fee;
}