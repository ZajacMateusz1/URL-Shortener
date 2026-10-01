#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/499b763c43309b5e71551cd5e6b5307ee201d6549014cb435337959d4a9198cd/contract';
import endContract from '../../snapshots/499b763c43309b5e71551cd5e6b5307ee201d6549014cb435337959d4a9198cd/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/dd5c3d186ebcb6c226780b052b76def6a37600b22e733e0435da5e7936f9f458/contract';
import startContract from '../../snapshots/dd5c3d186ebcb6c226780b052b76def6a37600b22e733e0435da5e7936f9f458/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'userVerification',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tokenHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'userVerification',
        constraint: 'userVerification_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'userVerification',
        index: 'userVerification_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'userVerification',
        foreignKey: {
          name: 'userVerification_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
