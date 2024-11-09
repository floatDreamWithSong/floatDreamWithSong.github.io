# Type Challenge

主要是练习泛型

## Simple Vue

题目如下，要求实现一个SimpleVue的声明，使得它能够通过类型检查

```ts
/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

SimpleVue({
  data() {
    // @ts-expect-error
    this.firstname
    // @ts-expect-error
    this.getRandom()
    // @ts-expect-error
    this.data()

    return {
      firstname: 'Type',
      lastname: 'Challenges',
      amount: 10,
    }
  },
  computed: {
    fullname() {
      return `${this.firstname} ${this.lastname}`
    },
  },
  methods: {
    getRandom() {
      return Math.random()
    },
    hi() {
      alert(this.amount)
      alert(this.fullname.toLowerCase())
      alert(this.getRandom())
    },
    test() {
      const fullname = this.fullname
      const cases: [Expect<Equal<typeof fullname, string>>] = [] as any
    },
  },
})
```

说实话，平常开发的时候，很少会去写这种类型声明，不过这个题目还是很有意思的，通过这个题目，可以学到很多泛型的知识

这三个互不相通的对象属性，却可以通过Ts泛型声明，使得我们在写代码的时候有类型提示，而不是像js那样要保证这个属性名是否正确

首先来分析：这是一个函数，我们肯定是要声明一个函数类型，具体什么我们不关心，我们现在只关心这里面的属性可以联系起来

这个函数应该接受一个对象作为参数，这个对象包含`data`、`computed`和`methods`三个属性，分别对应Vue中的数据、计算属性和方法

```ts
declaration function SimpleVue(options: {
    data: () => any
    computed: any
    methods: any
}): unknown
```

首先呢，既然后两个对象都可以通过访问到`data`的返回对象中的变量，那么我们首先要推断出`data`返回的值是什么呀

```ts
declaration function SimpleVue<TData>(options: {
    data: () => TData
    computed: any
    methods: any
}): unknown
```

这样可以通过类型推断，将`data`的返回值推断出来

但是注意到，我们后两个对象属性是通过this来访问的，欸，后两个对象的this怎么会指向`data`的返回值呢，肯定是我们将`data`的返回值作为了`this`的类型的一部分啊

```ts
declaration function SimpleVue<TData>(options: {
    data: () => TData
    computed: ThisType<TData>
    methods: any
}): unknown
```

然后对于`methods`，它可以通过`this`访问`data`和`computed`中的属性，所以我们可以将`data`和`computed`的返回值作为`methods`的`this`的类型的一部分
但是我们还没获取到TComputed，所以我们需要先推断出`computed`的自身内部声明的计算属性

```ts
declaration function SimpleVue<TData, TComputed>(
    options: {
        data: () => TData
        computed: TComputed & ThisType<TData>
        methods: ThisType<TData & TComputed>
}): unknown
```

但是，我们知道，计算属性毕竟是`属性`,我们是通过直接值来访问而不是像函数一样去调用它，所以我们实际需要的是`computed`中每个函数的返回值

那么我们需要一个辅助函数，来获取一个对象中的函数方法的返回值类型，

```ts
type getComputedRes<TComputed> = {
  [k in keyof TComputed]: TComputed[k] extends ()=> infer Return ? Return : never
}
```

> 大家都知道extends经常用来做类的`继承`，但是在这里，虽然也是继承的味道，但是它更多的是做一种声明，一种约束，表明我们要处理的对象应该是extends后面跟着的类型的一个子类型
> infer关键字用来推断类型，在extends后面，表示我们要推断的类型，需要三目运算符来返回推断出来的类型或者继续处理

现在我们的函数长这样：

```ts
type getComputedRes<TComputed> = {
  [k in keyof TComputed]: TComputed[k] extends ()=> infer Return ? Return : never
}
declare function SimpleVue<TData, TComputed>(options: {
  data:(this: void)=> TData
  computed: TComputed & ThisType<TData>
  methods: ThisType<TData & getComputedRes<TComputed>>
}): unknown

```

但是，`methods`中，里面的方法可以互相调用，因此，我们需要将`methods`中的函数的返回值类型也作为`methods`的`this`的类型的一部分
当然，我们得先推导出`methods`中的函数的返回值类型

最终如下：

```ts
type getComputedRes<TComputed> = {
  [k in keyof TComputed]: TComputed[k] extends ()=> infer Return ? Return : never
}
declare function SimpleVue<TData, TComputed, TMethod>(options: {
  data:(this: void)=> TData
  computed: TComputed & ThisType<TData>
  methods: ThisType<TData & getComputedRes<TComputed> & TMethod> & TMethod
}): unknown
```

## Curring 柯里化

题目

```ts
import type { Equal, Expect } from '@type-challenges/utils'

const curried1 = Currying((a: string, b: number, c: boolean) => true)
const curried2 = Currying((a: string, b: number, c: boolean, d: boolean, e: boolean, f: string, g: boolean) => true)
const curried3 = Currying(() => true)

type cases = [
  Expect<Equal<
    typeof curried1,
    (a: string) => (b: number) => (c: boolean) => true
  >>,
  Expect<Equal<
    typeof curried2,
    (a: string) => (b: number) => (c: boolean) => (d: boolean) => (e: boolean) => (f: string) => (g: boolean) => true
  >>,
  Expect<Equal<typeof curried3, () => true>>,
]
```

显然，柯里化，其实就是考察数组解构推导和递归了
由于Curring是一个函数，我们不能直接用它作为type来推导，因此额外声明一个Curry类型

```ts
type Curry<F> = F 

declare function Currying<F>(fn: F): Curry<F>
```

那么对于Curry， 我们需要：
- 首先获取到函数的参数类型，并且通过数组解构获取到第一个参数类型
- 然后获取到函数的返回值类型
- 然后通过递归，将剩余的参数类型和返回值类型作为参数传入Curry函数中

首先约束F是一个函数类型，然后infer出参数，返回值

```ts
type Curry<F> = F extends (...args: infer ARG) => infer R 
    ? // expression
    : never
```

接受我们要将参数解构出来，所以使用数组解构
如果参数不是数组，那么直接返回never

```ts
type Curry<F> = F extends (...args: infer ARG) => infer R 
    ? ARG extends [infer first, ...infer rest] 
        ? // expression
        : never
    : never
```

欸，这时候我们会想到，参数可能只有0或1个的时候，只需要直接返回F就可以了，于是添加一个判断

```ts
type Curry<F> = F extends (...args: infer ARG) => infer R 
    ? ( ARG['length'] extends 0|1 
        ? F 
        : ARG extends [infer first, ...infer rest]
            ? // expression
            : never
    : never
```

接下来，我们递归调用Curry函数，将剩余的参数类型和返回值类型作为参数传入

```ts
type Curry<F> = F extends (...args: infer ARG) => infer R 
    ? ( ARG['length'] extends 0|1 
        ? F 
        : ARG extends [infer first, ...infer rest]
            ?  (args: first) => Curry<(...args: rest) => R>
            : never
    : never
```

完整代码如下：

```ts
type Curry<F> = F extends (...args: infer ARG) => infer R 
    ? ( ARG['length'] extends 0|1 
        ? F 
        : ARG extends [infer first, ...infer rest]
            ?  (args: first) => Curry<(...args: rest) => R>
            : never
    : never

declare function Currying<F>(fn: F): Curry<F>
```
还是挺简单的，就是三目运算符太彀拔了

