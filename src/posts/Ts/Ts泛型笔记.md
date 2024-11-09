# TS 泛型

## 常用的泛型函数

```ts
type Pick<Type, Keys extends keyof Type> = {
    [Property in Keys]: Type[Property];
}

type Readonly<T> = {
    readonly [P in keyof T]: T[P];
}

// Partial<T> 将 T 的所有属性变为可选
type Partial<T> = {
    [P in keyof T]: T[P] | undefined;
}

// Record将 K 的所有属性值变为 T 类型
type Record<Keys extends keyof any, T> = {
    [Property in Keys]: T;
}

// Exclude<T, U> 从 T 中排除 U, 作用于联合类型，或者keys
type Exclude<T, U> = T extends U ? never : T;

// Omit<T, K> 从 T 中排除 K
// Omit 与 Exclude的区别在于 Omit 可以作用于对象
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

type NonNullable<T> = T extends null | undefined ? never : T;

// ReturnType<T> 获取函数返回值类型，总是一个数组
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;
```
