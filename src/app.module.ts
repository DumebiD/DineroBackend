import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { RuleModule } from './rule/rule.module.js';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { QuoteModule } from './quote/quote.module.js';
import { LedgerEntryModule } from './ledger_entry/ledger_entry.module.js';
import { FeeModule } from './fee/fee.module.js';
import { typeormConfig } from './config/typeorm.config.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // for interpolation (using variables in other variables) in my env
      expandVariables: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeormConfig,
    }),
    RuleModule,
    QuoteModule,
    LedgerEntryModule,
    FeeModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
