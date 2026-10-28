import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    ValueTransformer,
} from 'typeorm';

export enum RuleStatus {
    Active = 'Active',
    Inactive = 'Inactive',
}

export enum TransactionType {
    Transfer = 'Transfer',
    // add others, e.g. Withdrawal = 'Withdrawal'
}

export enum RuleAction {
    ApplyFee = 'ApplyFee',
    Waive = 'Waive',
}

// ---- Conditions ----

// export type CategoricalField = 'channel' | 'customer_segment' | 'destination_type';
// export type NumericField = 'amount' | 'monthly_volume' | 'transaction_count';
export type CategoricalField = 'channel' | 'destination_type';
export type NumericField = 'amount';

export type CategoricalOp = 'equals' | 'not_equals' | 'in';
export type NumericOp = 'gt' | 'lt' | 'between';

export interface CategoricalCondition {
    id: string;
    field: CategoricalField;
    op: CategoricalOp;
    value: string | string[];      // string for equals/not_equals, array for in
}

export interface NumericCondition {
    id: string;
    field: NumericField;
    op: NumericOp;
    value: number | [number, number]; // number for gt/lt, [min, max] for between
}

export type Condition = CategoricalCondition | NumericCondition;

// A rule matches when ALL conditions in the list are true.
// An empty list means "always matches".
export interface RuleConditions {
    all: Condition[];
}

// TypeORM returns numeric columns as strings; this converts them to numbers.
const numeric: ValueTransformer = {
    to: (v?: number | null) => v,
    from: (v?: string | null) => (v == null ? null : parseFloat(v)),
};

@Entity('rule')
export class Rule {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({type: 'varchar'})
    summary: string;

    @Column({ type: 'boolean' })
    active: boolean;

    @Column({ type: 'int' })
    priority: number;                // lower = evaluated first

    @Column({ type: 'enum', enum: TransactionType })
    transactionType: TransactionType;

    @Column({ type: 'enum', enum: RuleAction, default: RuleAction.ApplyFee })
    action: RuleAction;

    @Column({ type: 'varchar', nullable: true })
    approverGroup: string | null;    // only relevant if a rule needs approval

    // @Column({ type: 'jsonb', default: () => `'{"all":[]}'` }) - no space
    @Column({ type: 'jsonb', default: () => `'{"all": []}'` })
    conditions: RuleConditions;

    // ---- Fee ----
    // A fixed amount charged regardless of transaction size
    @Column({ type: 'numeric', precision: 18, scale: 2, default: 0, transformer: numeric })
    flatAmount: number;

    @Column({ type: 'numeric', precision: 7, scale: 4, default: 0, transformer: numeric })
    percent: number;                 // 0.5 means 0.5%

    @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true, transformer: numeric })
    minFee: number | null;

    @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true, transformer: numeric })
    maxFee: number | null;

    @CreateDateColumn()
    createdAt: Date;
}