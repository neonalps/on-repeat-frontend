export interface KeyValueStore<T> {
    get(key: string): T | null;
    put(key: string, value: T): void;
    remove(key: string): void;
}