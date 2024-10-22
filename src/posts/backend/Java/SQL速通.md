# SQL 选择查询速通

一张表，一行是一条数据，一列是这个表中的元素应有的属性
一个表就算一个类，一列就是一个结构体属性，每一行是一个类实例

## 基础的选择

``` sql
select attr_name from table_name
```

## 条件的选择

``` sql
select attr_name from table_name where condition
```

## condition

condition 可以替换为如下表达式
表达式可以用and， or 链接，not修饰

``` sql
atrr_name is value
attr_name is not value
attr_name is null
atrr_name not like '%value_' -- 这个%相当于正则的.*，_相当于正则的.。
atrr_name (= 或 >= 或 <= 或 != 或 =) value
atrr_name between value1 and value2

```

## 修饰符

### distinct 去重

对于当前选择的几个字段的组合，是不会重复

``` sql
select distinct attr_x, attr_y from table_name
```

### 按序获取/排序获取

升序ASC,降序DESC，order by 首要， 次要， 次次要 ...

``` sql
select name, age, score from student order by score DESC, age ASC
```

### limit 截断

从第二个人（index == 1）三个人

``` sql
select name, age from student order by age ASC limit 3 -- 选三个人
select name, age from student order by age ASC limit 1,3 -- 从第二个人（index == 1）开始选三个人
```

## 分支 case when

``` sql
select
  name,
  case
    when (age > 60) then '老同学'
    when age > 20 then '年轻'
    else '小同学'
  end as age_level
from
  student
order by
  name ASC
```

## 时间

时间这一坨主要是调函数
根据系统时间生成，下面只列了几个，还有很多hhh

``` sql
-- 获取当前日期
SELECT DATE() AS current_date;

-- 获取当前日期时间
SELECT DATETIME() AS current_datetime;

-- 获取当前时间
SELECT TIME() AS current_time;
```

## 字符串

lower upper length 等

``` sql
UPPER(name) AS upper_name
```

## 聚合函数

count, sum, avg, max, min 等。直接对attr_name用就行了

## 分组聚合

### group by

group by attr_name 根据atrr_name 分批计算

单字段示例：

``` sql
select class_id, avg(score) as avg_score from student group by class_id -- 计算班级平均分
```

多字段就是group by attr_x, attr_y...

### having

HAVING 子句与条件查询 WHERE 子句的区别在于，WHERE 子句用于在 分组之前 进行过滤，而 HAVING 子句用于在 分组之后 进行过滤。

``` sql
select class_id, sum(score) as total_score from student group by class_id having sum(score) > 150 -- 获取总分大于150的班级
```

## 关联查询

### cross join

有时，我们可能希望在单张表的基础上，获取更多额外数据，比如获取学生表中学生所属的班级的班级信息等。这时，就需要使用关联查询。

在 SQL 中，关联查询是一种用于联合多个数据表中的数据的查询方式。

其中，CROSS JOIN 是一种简单的关联查询，不需要任何条件来匹配行，它直接将左表的 每一行 与右表的 每一行 进行组合，返回的结果是两个表的笛卡尔积。

``` sql
select
  s.name as student_name,
  s.age as student_age,
  s.class_id,
  c.name as class_name
from
  student s
  cross join class c -- 获取 cross的表是右×的，毕竟cross是叉乘
```

### inner join

取两个表的条件交集
关键是JOIN departments d ON condition

``` sql
select
  s.name as student_name,
  s.age as student_age,
  s.class_id,
  c.name as class_name,
  c.level as class_level
from
  student s
  join class c on c.id = s.class_id -- 这个才比较正常
```

### outer join

在 SQL 中，OUTER JOIN 是一种关联查询方式，它根据指定的关联条件，将两个表中满足条件的行组合在一起，并 包含没有匹配的行 。

在 OUTER JOIN 中，包括 LEFT OUTER JOIN 和 RIGHT OUTER JOIN 两种类型，它们分别表示查询左表和右表的所有行（即使没有被匹配），附加上满足条件的交集部分。

详细链接[!https://www.runoob.com/sql/sql-join.html]

``` sql
select
  s.name as student_name,
  s.age as student_age,
  s.class_id,
  c.name as class_name,
  c.level as class_level
from
  student s
  left join class c on s.class_id = c.id
```

## 子查询

子查询是指在一个查询语句内部 嵌套 另一个完整的查询语句，内层查询被称为子查询。子查询可以用于获取**更复杂的查询结果或者用于过滤数据**。

当执行包含子查询的查询语句时，数据库引擎会首先执行子查询，然后将其结果作为条件或数据源来执行外层查询。

打个比方，子查询就像是在一个盒子中的盒子，外层查询是大盒子，内层查询是小盒子。执行查询时，我们首先打开小盒子获取结果，然后将小盒子的结果放到大盒子中继续处理。

举个例子，学校有很多学生包括毕业生都在数据库内，我们只想查询当前这届学生，先在班级表选出符合的班级id，再在学生表中根据班级id来区分是否是这届的学生

``` sql
select
  name,
  score,
  class_id
from
  student
where
  class_id in (
    select
      id
    from
      class
  )
```

子查询中的一种特殊类型是 "exists" 子查询，用于检查主查询的结果集是否存在满足条件的记录，它返回布尔值（True 或 False），而不返回实际的数据。

``` sql
select
  s.name,
  s.age,
  s.class_id
from
  student s
where
  not exists (
    select
      id
    from
      class
    where
      class.id = s.class_id
  )
```

## 联合/组合查询 union

UNION 操作：它用于将两个或多个查询的结果集合并， 并去除重复的行 。即如果两个查询的结果有相同的行，则只保留一行。

UNION ALL 操作：它也用于将两个或多个查询的结果集合并， 但不去除重复的行 。即如果两个查询的结果有相同的行，则全部保留。

``` sql
select
  name,
  age,
  score,
  class_id
from
  student
union all
select
  name,
  age,
  score,
  class_id
from
  student_new
```

## 开窗

在 SQL 中，开窗函数是一种强大的查询工具，它允许我们在查询中进行对分组数据进行计算、 同时保留原始行的详细信息 。

开窗函数可以与聚合函数（如 SUM、AVG、COUNT 等）结合使用，但与普通聚合函数不同，开窗函数不会导致结果集的行数减少。

打个比方，可以将开窗函数想象成一种 "透视镜"，它能够将我们聚焦在某个特定的分组，同时还能看到整体的全景。

``` sql
SUM(计算字段名) OVER (PARTITION BY 分组字段名 ORDER BY 字段名)

select *, avg(score) over (partition by class_id) as class_avg_score from student

select id, name, age, score, class_id, sum(score) over (partition by class_id order by score ASC) as class_sum_score from student;

```

### 开窗函数 Rank

Rank 开窗函数是 SQL 中一种用于对查询结果集中的行进行 排名 的开窗函数。它可以根据指定的列或表达式对结果集中的行进行排序，并为每一行分配一个排名。在排名过程中，相同的值将被赋予相同的排名，而不同的值将被赋予不同的排名。

当存在并列（相同排序值）时，Rank 会跳过后续排名，并保留相同的排名。

Rank 开窗函数的常见用法是在查询结果中查找前几名（Top N）或排名最高的行。

Rank 开窗函数的语法如下：

``` sql
RANK() OVER (
  PARTITION BY 列名1, 列名2, ... -- 可选，用于指定分组列
  ORDER BY 列名3 [ASC|DESC], 列名4 [ASC|DESC], ... -- 用于指定排序列及排序方式
) AS rank_column
-- 示例：计算学校的每个学生在班级的排名

select id, name, age, score, class_id, rank() over (partition by class_id order by score DESC) as ranking from student

```

### row_number

Row_Number 函数为每一行都分配一个唯一的整数值，不管是否存在并列（相同排序值）的情况。每一行都有一个唯一的行号，从 1 开始连续递增。

Row_Number 开窗函数的语法如下（几乎和 Rank 函数一模一样）

``` sql
ROW_NUMBER() OVER (
  PARTITION BY column1, column2, ... -- 可选，用于指定分组列
  ORDER BY column3 [ASC|DESC], column4 [ASC|DESC], ... -- 用于指定排序列及排序方式
) AS row_number_column

select
  id,
  name,
  age,
  score,
  class_id,
  row_number() over (
    partition by class_id
    order by
      score DESC
  ) as row_number
from
  student;
```

### lag lead

开窗函数 Lag 和 Lead 的作用是获取在当前行之前或之后的行的值，这两个函数通常在需要比较相邻行数据或进行时间序列分析时非常有用。

Lag 函数用于获取 当前行之前 的某一列的值。它可以帮助我们查看上一行的数据。
Lead 函数用于获取 当前行之后 的某一列的值。它可以帮助我们查看下一行的数据。

Lag 函数的语法如下：

LAG( 字段, 向上的偏移行数, default_value) OVER (PARTITION BY partition_column ORDER BY sort_column)

> 参数解释：
> default_value：可选参数，用于指定当没有前一行时的默认值。
> PARTITION BY 和 ORDER BY子句可选，用于分组和排序数据。

``` sql
select
  id,
  name,
  age,
  score,
  class_id,
  lag(name, 1) over (
    partition by class_id
    order by
      score DESC
  ) as prev_name
  , lead(name, 1) over (
    partition by class_id
    order by
      score DESC
  ) as next_name
from
  student;

```

查询篇完结~~
