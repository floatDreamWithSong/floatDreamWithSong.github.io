# 极速上手

虽然idea提供了智能辅助生成构造器，重写toString，getter,setter这类常用小方法，但是在源文件字段较多的情况下生产出来的类会很繁杂

java17提供了record，但是record不能提供setter，另外也不够灵活

那么有没有一种更加完美的方案来处理这种问题呢？通过使用Lombok（小辣椒）就可以做到，它就是专门用于简化 Java 编程中的样板代码的，它通过注解的方式，能够自动生成常见的代码，比如构造函数、getter 和 setter 方法、toString 方法、equals 和 hashCode 方法等，从而使开发者能够专注于业务逻辑，而不必重复编写冗长的代码，例如：

``` java
@Getter
@Setter
@AllArgsConstructor
public class Student {
    private Integer sid;
    private String name;
    private String sex;
}

```

## 安装

``` xml
<dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
  <version>1.18.34</version>
  <scope>provided</scope>
</dependency>
```

lombok的插件IEDA 专业版/终极版是默认有的

## 使用

其实日常也就那么几个

省事的话直接`@Data`就好了
