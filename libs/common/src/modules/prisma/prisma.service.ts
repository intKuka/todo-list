import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.POSTGRES_URL,
        },
      },
    });
  }

  excludeFieldsFromObject<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => !keys.includes(key as K)),
    ) as Omit<T, K>;
  }

  excludeFieldsFromList<T, K extends keyof T>(
    objects: T[],
    keysToDelete: K[],
  ): Omit<T, K>[] {
    return objects.map((obj) =>
      this.excludeFieldsFromObject(obj, keysToDelete),
    ) as Omit<T, K>[];
  }
}
