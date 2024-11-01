# CPU scheduling

## 原则

## 调度算法

### 先来先服务（FCFS）

### 最短作业优先（SJF）

### 最短剩余时间优先（SRTF）

### 轮转 (RR: Round Robin)

轮转时间间隔控制在合适范围，太小导致切换效率低，太高导致接近于FCFS。

> turnaround time (轮转时间) = burst time （执行时间） + waiting time （等待时间）

## 优先级调度（Priority Scheduling）

SJF 是以作业时间作为优先级的priority scheduling算法。

> 问题：
> 饥饿：低优先级的作业长期得不到调度，导致长时间等待，称为饥饿。
> 解决：
> 老化：随着时间增加，还在等待的进程优先级逐渐升高

## 多级队列（Multilevel Queue）

## 多级反馈队列（Multilevel Feedback Queue）

parameters:

- 队列数目
- 每个队列的调度算法
- 每个队列的优先级升降算法（upgrade/dometo）
- 进程进入队列的条件

## 竞争范围 （contetion scope）

> SCS: system conteion scope
> PCS: process conteion scope

## 多核处理器 MPS (Multi-Processor Scheduling)

> 内存停顿
> 解决：如果一个线程因为内存停顿等待，则切换到另一个线程，直到内存可用。

有以下结构特征：
- mutilcore cpu
- mutilthread cores
- NUMA (Non-Uniform Memory Access)
- Heterogeneous system(异构系统)

### SMP (Symmetric Multi-Processing)

SMP每个处理器都有自己的调度
所有的线程有可能都在同一个就绪队列
处理器有自己的线程队列

### MMS (mutilthread multi-core system)

### LB (Load Balancing) 负载均衡

### 亲和性 (affinity)

## Real-Time Scheduling

soft real-time scheduling