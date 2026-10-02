#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/0162be360b99785c1f952d82e161d8ebba25bdb7515ca6d8776bd0cb077aa18a/contract';
import endContract from '../../snapshots/0162be360b99785c1f952d82e161d8ebba25bdb7515ca6d8776bd0cb077aa18a/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/2db41fb9d060d4c393eb1bef3bc3add405904224cf6fdcb8d3bae0df2bf1d3c8/contract';
import startContract from '../../snapshots/2db41fb9d060d4c393eb1bef3bc3add405904224cf6fdcb8d3bae0df2bf1d3c8/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'PasswordReset',
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
        table: 'PasswordReset',
        constraint: 'PasswordReset_userId_key',
        columns: ['userId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'PasswordReset',
        constraint: 'PasswordReset_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'PasswordReset',
        foreignKey: {
          name: 'PasswordReset_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
