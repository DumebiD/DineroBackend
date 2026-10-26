import { Type } from 'class-transformer';
import {
    ArrayMaxSize,
    IsArray,
    IsBoolean,
    IsEnum,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
    ValidateNested,
    Validate,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    isUUID,
    IsUUID,
} from 'class-validator';
import { RuleAction, TransactionType } from '../entities/rule.entity.js';

// Runtime versions of the type unions in rule.entity.ts.
// Keep these in sync with CategoricalField / NumericField / the op types.
const CATEGORICAL_FIELDS = ['channel', 'destination_type'] as const;
const NUMERIC_FIELDS = ['amount'] as const;
const CATEGORICAL_OPS = ['equals', 'not_equals', 'in'] as const;
const NUMERIC_OPS = ['gt', 'lt', 'between'] as const;

const ALL_FIELDS = [...CATEGORICAL_FIELDS, ...NUMERIC_FIELDS];
const ALL_OPS = [...CATEGORICAL_OPS, ...NUMERIC_OPS];

const isNum = (v: unknown): v is number =>
    typeof v === 'number' && Number.isFinite(v);

// Checks that field, op and value make sense together, e.g.
// amount + between must have [min, max], channel + in must have string[].
@ValidatorConstraint({ name: 'conditionValue', async: false })
class ConditionValueConstraint implements ValidatorConstraintInterface {
    validate(value: unknown, args: ValidationArguments): boolean {
        const { field, op } = args.object as ConditionDto;

        if ((NUMERIC_FIELDS as readonly string[]).includes(field)) {
            if (!(NUMERIC_OPS as readonly string[]).includes(op)) return false;
            if (op === 'between') {
                return (
                    Array.isArray(value) &&
                    value.length === 2 &&
                    value.every(isNum) &&
                    value[0] <= value[1]
                );
            }
            return isNum(value);
        }

        if ((CATEGORICAL_FIELDS as readonly string[]).includes(field)) {
            if (!(CATEGORICAL_OPS as readonly string[]).includes(op)) return false;
            if (op === 'in') {
                return (
                    Array.isArray(value) &&
                    value.length > 0 &&
                    value.every((v) => typeof v === 'string' && v.length > 0)
                );
            }
            return typeof value === 'string' && value.length > 0;
        }

        return false;
    }

    defaultMessage(args: ValidationArguments): string {
        const { field, op } = args.object as ConditionDto;
        return `value is not valid for field "${field}" with operator "${op}"`;
    }
}

export class ConditionDto {
    @IsUUID()
    id: string;

    @IsIn(ALL_FIELDS)
    field: (typeof ALL_FIELDS)[number];

    @IsIn(ALL_OPS)
    op: (typeof ALL_OPS)[number];

    @Validate(ConditionValueConstraint)
    value: string | string[] | number | [number, number];
}

export class RuleConditionsDto {
    @IsArray()
    @ArrayMaxSize(20)
    @ValidateNested({ each: true })
    @Type(() => ConditionDto)
    all: ConditionDto[];
}

export class CreateRuleDto {
    @IsOptional()
    @IsUUID()
    id?: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    name: string;

    @IsString()
    @MaxLength(500)
    summary: string;

    @IsBoolean()
    active: boolean;

    @IsInt()
    @Min(0)
    priority: number;

    @IsEnum(TransactionType)
    transactionType: TransactionType;

    @IsOptional()
    @IsEnum(RuleAction)
    action?: RuleAction;  // defaults to ApplyFee

    @IsOptional()
    @IsString()
    @MaxLength(120)
    approverGroup?: string | null;

    @IsOptional()
    @ValidateNested()
    @Type(() => RuleConditionsDto)
    conditions?: RuleConditionsDto;  // defaults to {"all":[]}

    // ---- Fee ----

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    flatAmount: number;

    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(0)
    @Max(100)
    percent: number;                       // 0.5 means 0.5%

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    minFee?: number | null;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    maxFee?: number | null;
}
