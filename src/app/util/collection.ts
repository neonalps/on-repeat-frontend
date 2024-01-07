import { isDefined } from "@src/app/util/common";

export function groupBy<K, V>(list: V[], keyGetter: (input: V) => K): Map<K, V[]> {
    const result = new Map();
    list.forEach((item: V) => {
        const key: K = keyGetter(item);
        const collection: V[] = result.get(key);
        if (isDefined(collection)) {
            collection.push(item);
        } else {
            result.set(key, [item]);
        }
    });
    return result;
}