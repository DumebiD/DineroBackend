import { Body, Controller, Post } from '@nestjs/common';
import { FeeQuoteDto } from './dto/create-fee.dto.js';
import { FeeService } from './fee.service.js';

@Controller('fees')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @Post('quote')
  async quote(@Body() dto: FeeQuoteDto) {
    const ctx = {
      amount: dto.amount,
      channel: dto.channel,
      destination_type: dto.destination_type,
    };

    const { fee } = await this.feeService.calculateFee(dto.transactionType, ctx);
    return { amount: dto.amount, fee, total: dto.amount + fee };
  }
}