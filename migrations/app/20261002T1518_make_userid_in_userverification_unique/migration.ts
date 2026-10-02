#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/2db41fb9d060d4c393eb1bef3bc3add405904224cf6fdcb8d3bae0df2bf1d3c8/contract';
import endContract from '../../snapshots/2db41fb9d060d4c393eb1bef3bc3add405904224cf6fdcb8d3bae0df2bf1d3c8/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/5aca1629b9146477492ec2a11f8683b8662521ea9c2ee94a45e534b235940cff/contract';
import startContract from '../../snapshots/5aca1629b9146477492ec2a11f8683b8662521ea9c2ee94a45e534b235940cff/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropIndex({
        schema: 'public',
        table: 'userVerification',
        index: 'userVerification_userId_idx_a489d58a',
      }),
      this.addUnique({
        schema: 'public',
        table: 'userVerification',
        constraint: 'userVerification_userId_key',
        columns: ['userId'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
