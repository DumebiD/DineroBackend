import { TransactionType } from "../../rule/entities/rule.entity.js";
import {IsNumber, IsString} from 'class-validator'

export class CreateFeeDto {}
export class FeeQuoteDto {
  transactionType: TransactionType;

  @IsNumber()
  amount: number;

  @IsString()
  channel: string;
  destination_type: string;
}