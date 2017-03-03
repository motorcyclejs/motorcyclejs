import { Stream, merge } from 'most';

export function mergeObjects<A extends { [key: string]: Stream<any> }>(...objs: Array<A>): A {
  if (objs.length === 1)
    return objs[0];

  const mergedObject = {} as A;

  objs.forEach((obj: A) => {
    const keys = Object.keys(obj);

    keys.forEach((key: keyof A) => {
      const value = obj[key];

      if (!mergedObject[key])
        mergedObject[key] = value;
      else
        mergedObject[key] = merge(mergedObject[key], value);
    });
  });

  return mergedObject;
}
