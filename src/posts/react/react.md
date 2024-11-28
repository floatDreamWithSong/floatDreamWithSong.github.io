# React

React是一个很有哲学意味的框架，它的很多运行机制都体现了“纯粹”的理念。

## useRef


### 特点

`ref`是一个脱围机制，避免React检测到它的变化，从而避免不必要的渲染。同时又不像普通变量在重渲染时被重置。

### 用法

通过`useRef`创建一个ref对象，通过`ref.current`访问该对象。

还可以操作DOM节点，需要在JSX上使用`ref`属性来指定。

### 解决

如果是自定义的组件，可以通过`forwardRef`来传递ref。暴露DOM对象时可以通过`useImperativeHandle`来只暴露必要的属性、事件等。

## useEffect

### 结构

```js
useEffect(() => {
  // 回调函数
  // 这里的处理逻辑应该是副作用，是由于组件渲染了才需要额外执行的同步策略，比如数据获取、订阅或者手动更改DOM，
  // 而不是由特定交互事件引起的，
  return () => {
    // 自定义清理函数
  }
}, [依赖项, ...])
```

### 运行机制

在组件渲染到屏幕之后执行`useEffect`的回调函数，React 会在 Effect 再次运行之前和在组件卸载时调用你的清理函数。

依赖项是可选的，如果依赖项发生变化，则重新执行`useEffect`的回调函数。

如果依赖项为空数组，则只在组件首次渲染后执行一次。

对于`ref`类型的依赖项，React不会检测它的变化，因为它是脱围机制。

### 开发时特性

React在开发环境下，会装载两次，卸载一次以自动测试组件的渲染和卸载。这有利于你检查组件卸载时是否正确地清理了Effect。

### 陷阱

禁止在`useEffect`的回调函数中直接修改`state`，因为每次修改`state`都会触发组件的重新渲染，而重新渲染又会触发`useEffect`的回调函数，从而形成无限循环。

[你可能不需要Effect](https://zh-hans.react.dev/learn/you-might-not-need-an-effect)

## useReducer

### 特点

`useReducer`是`useState`的替代方案，相比`useState`，它更体现了一种`集中管理`、`纯函数`，将事件处理与状态管理分离开来的策略。

### 用法

```js
const [state, dispatch] = useReducer(reducer, initState)
```

`reducer`是一个纯函数，用于计算新的状态。

`dispatch`是一个函数，用于触发`reducer`，它的派发对象将作为`reducer`的第二个参数。

`reducer`的返回值将作为新的状态。

`reducer`函数：

``` tsx
reducer(state, action) => newState
```

`state`是当前的状态，`action`是派发对象，`newState`是新的状态。

## useMemo

### 特点

`useMemo`是`useCallback`的替代方案，相比`useCallback`，它更体现了一种`缓存`、`纯函数`，将事件处理与状态管理分离开来的策略。

### 用法

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

## useCallback

### 特点

`useCallback`是`useMemo`的替代方案，相比`useMemo`，它更体现了一种`缓存`、`纯函数`，将事件处理与状态管理分离开来的策略。

### 用法

```js
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

## memo

### 特点

`memo`是`useMemo`的替代方案，相比`useMemo`，它更体现了一种`缓存`、`纯函数`，将事件处理与状态管理分离开来的策略。

### 用法

```js
const MemoizedComponent = memo(Component, areEqual);
```