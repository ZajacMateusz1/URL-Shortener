#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/499b763c43309b5e71551cd5e6b5307ee201d6549014cb435337959d4a9198cd/contract';
import startContract from '../../snapshots/499b763c43309b5e71551cd5e6b5307ee201d6549014cb435337959d4a9198cd/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/5aca1629b9146477492ec2a11f8683b8662521ea9c2ee94a45e534b235940cff/contract';
import endContract from '../../snapshots/5aca1629b9146477492ec2a11f8683b8662521ea9c2ee94a45e534b235940cff/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('isVerified', 'bool', {
          notNull: true,
          default: lit(false),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
