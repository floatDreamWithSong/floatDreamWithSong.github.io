# 极速 Mybatis

## 配置文件

``` xml
<?xml version="1.0" encoding="UTF-8" ?>
<!-- 这个DTD是用来约束标签的，相当于智能提示吧-->
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- enviroments 只是用来包裹和选择环境的-->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/web_study"/>
                <property name="username" value="test"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>
    <mappers>
    <!-- 导入你的sql操作-->
        <mapper url="file:mappers/TestMapper.xml"/>
    </mappers>
</configuration>
```

配置文件完成后，接着我们就可以通过Java来使用Mybatis了，首先我们要介绍的是SqlSessionFactoryBuilder它用于构建SqlSessionFactory对象，每个基于 MyBatis 的应用都是以一个 SqlSessionFactory 的实例为核心的，使用也很简单，这里我们使用的是XML的形式进行配置的：

``` java
public static void main(String[] args) throws FileNotFoundException {
   //使用build方法来创建SqlSessionFactory，这里我们通过文件输入流传入配置文件
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(new FileInputStream("mybatis-config.xml"));
}

```

获取到sql会话工厂后，就可以创建一定数量的sql会话

看一下sql会话的接口：

``` java
public interface SqlSession extends Closeable {
    <T> T selectOne(String statement);
    <T> T selectOne(String statement, Object parameter);
    <E> List<E> selectList(String statement);
    ...
    int insert(String statement);
    int insert(String statement, Object parameter);
    int update(String statement);
    int update(String statement, Object parameter);
    int delete(String statement);
    int delete(String statement, Object parameter);

```

看起来还挺好。。

由于Mybatis并不知道我们具体需要执行的SQL语句，以及需要返回哪些数据作为结果，因此我们同样需要编写配置文件来告诉Mybatis我们要做什么。
写一个xml作为我们的SQL语句映射配置

``` xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="testMapper">
  <select id="selectAllUser" resultType="com.test.User">
    select * from user
  </select>
</mapper>

```

Mybatis会自动映射到实体类

``` java
@Data
public class User {   //属性名称必须和数据库中字段名称一一对应，不然会赋值失败
    int id;
    String name;
    int age;
}

```

使用

``` java
try (SqlSession session = sqlSessionFactory.openSession(true)) {
    List<User> users = session.selectList("selectAllUser");  //直接填写我们刚刚编写的mapper的id
    users.forEach(System.out::println);  //直接查询并自动转换为对应类型
}

```

## 动态传参

比如我们要选择给定条件的id和age的数据。

在会话方法后面可以接入一个参数，这个参数类型你可以指定，也可以不写让它自动推导

``` xml
<select id="selectUserById" parameterType="int" resultType="com.test.User">
    <!--这里传参相当于一个占位符，printf的那种-->
    select * from user where id = #{id}
</select>

```

如果写包名太累了在Mybatis配置项里面写别名

``` xml
<typeAliases>
    <typeAlias type="com.test.User" alias="User"/>
</typeAliases>

<!-- 或者自动扫描-->
<typeAliases>
    <package name="com.test.entity"/>
</typeAliases>

```

多个参数传需要一个实体类，更简单的匿名写法是：

``` java
User user = session.selectOne("selectUserByIdAndAge", Map.of("id", 1, "age", 18));
System.out.println(user);

```

数据库字段和类实体字段有可能不匹配，可以在配置中手动map以下

``` xml
<select id="selectUserByIdAndAge" resultMap="user">
    select * from user where id = #{id} and age = #{age}
</select>
<resultMap id="user" type="com.test.User">
  	<!-- 因为id为主键，这里也可以使用<id>标签，有助于提高性能 -->
    <result column="id" property="uid"/>
    <result column="name" property="username"/>
</resultMap>
```

实体类如下

``` java
@Data
public class User {
    int uid;
    String username;
    int age;
}

```

由于xml也需要对特殊符号进行处理

``` xml
<select id="selectUsersByAge" resultType="com.test.User">
    select * from user where age &gt; #{age};
</select>

```

我们主要还是以selectOne和selectList，有时候又selectMap,另说，还有个普通的select，需要传入一个lambda或者其他函数来处理
