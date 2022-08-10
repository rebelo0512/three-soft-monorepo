/* c8 ignore start */
export abstract class ICacheBaseRepository {
  abstract key: string;

  abstract getCache(): Promise<string | null>;
  abstract setKey(key: string): void;
  abstract setCache(values: string, time: number): Promise<void>;
  abstract deleteCache(): Promise<void>;
}
/* c8 ignore stop */
