# Core Concept

> aop beans context core(di,ioc) spel

Spring是一个非入侵式的框架，就像一个工具库一样。

(欸，是不是想到了JQ👀，都是像工具库一样的框架。而现在前端工程化的编译器都转向Rust了)

Spring可以很简单地加入到我们已有的项目中，因此，我们只需要直接导入其依赖就可以使用了，Spring核心框架的Maven依赖坐标：

maven 就像package.json作为依赖包，不过不太好看。。。对坐标的要求还比较麻烦点。

``` xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>6.1.10</version>
</dependency>
```

## IOC

**强耦合**：A类显示地引入了依赖B类。

**IOC解耦** ：A类使用固定的interface接口类，B类去实现这个接口（或者父类）。
由于interface类是不能被实例化的，因此我们还是需要实例化一个类注入这个接口。
谁去负责实例化？既然要A，B类都不关心外部联系，那么这个任务交给了第三方，也就是Spring
Spring咋个晓得要用哪个类？

> 1. 约定大于配置，有默认情况，这个可以通过java的反射获取到类的源码字符信息
> 2. 自己写配置，Spring载入

## 写着玩，乱讲

新建的java项目导入dependency后，在resource下新建一个.xml文件，写入

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">
</beans>
```

这个内容是用来声明校验规则等，不过最主要的还是，我们的bean配置要放在beans内部，这个文件就是我们的context，上下文。

我们可以用加载.xml配置文件的方式获取，（还有class类配置等其他上下文获取方式）

``` java
ApplicationContext context = new ClassPathXmlApplicationContext("test.xml");
```

bean 有两个重要属性，一个是name，一个是class（资源类的path）
name属性就是用来归类的，相当于id，我们在获取bean的时候也是可以通过name获取的getBean("your_name")。
也可以加上一个alias属性，就是起一个别名，效果和name一样。
我们也可以通过反射，用传入getBean(类.class),如果你不想指定name的话。
但是这样不就产生依赖了么，，

你可以将bean写在beans内部

``` xml
<bean name="student" class="com.spr.Student"/>
```

这样就完成了“生产者”通过bean的形式提供给Spring

然后我们的“消费者”可以通过上下文context，通过name来获取bean，也就是生产者类。

上下文可以理解为一段组织关系，你的应用应该可以创建多个上下文。

不过毕竟是运行时获取，你获取到了bean也不能直接写死，获取到什么类啊。

所以要新建一个接口类，接口类暴露必要的api，其他的实现细节都可以隐藏，到时候业务类更换了也无妨，让接口的implement 类变成新的业务类就OK了，只要你实现了必要的接口方法。
而且可以隐藏实现细节和一些其他的属性之类的。

我们获取到对象后再获取一次呢？返回的是同一个对象，其实现内部采用了单例模式。

如果你想要每次获取都是不同的对象，可以修改bean的属性scope为prototype（原型模式），而scope默认情况下就是为singleton（单例）
并且单例模式下，上下文加载时就把这个单例对象创建了。原型模式就是在你使用的时候才new一个。

所以你也可以设置bean的属性lazy-init为true，让单例对象在第一次真正获取bean的时候才创建。。

如果bean之间也有简单的加载顺序关系，bean的depend-on属性可以指定在某个bean加载后加载。

## DI

DI和我们刚才手动获取bean就不太一样了，DI简化了我们获取bean的方式，不过它是对于类上的成员，如果你要在函数栈内存里面获取bean还是手动。

依赖注入对象要求对象有个目标一个setter方法

我们在bean中使用DI时，需要在需要注入bean的bean中添加property标签。

property标签的属性：

- name，就是你的java类的属性名，因为是通过反射，要属性名和name相同才知道注入哪个
- ref，也就是需要注入的bean是什么？在这里写入那个bean的name
- value，如果你不想注入什么类，而是在外部注入一个值，那么也可以在这里填入

集合类的参数稍微麻烦点：

``` xml
      <!--  对于集合类型，我们可以直接使用标签编辑集合的默认值  -->
    <property name="list">
        <list>
            <value>AAA</value>
            <value>BBB</value>
            <value>CCC</value>
        </list>
    </property>
   <property name="map">
        <map>
            <entry key="语文" value="100.0"/>
            <entry key="数学" value="80.0"/>
            <entry key="英语" value="92.5"/>
        </map>
    </property>
```

之前是用setter方法，而setter方法是在类创建完成后注入的。
如果你想用有参构造器，在类创建时注入，那么...可以在bean下将property换用constructor-arg标签，它的属性有

- type
- value
- name
- ref

自动装配：让Spring自己去找啊。那你需要给bean提供autowire的属性值，byName 或者 byType，我们不需要显示的写property了。
当然我们还是得提供一下setter方法。如果你要用构造器，autowire的值应该为constructor，你也要提供参数构造器，参数也还是默认byType

bean有个autowire-candidate，显式设置为false可以让它暂时不参与bean，或者对要使用的bean设置primary属性为true，这样如果一个父类有多个子类实现并且注入的规则时byType的，就可以这样避免自动装配时Spring不知道选哪个子类

生命周期：不管哪个框架都要遇到这玩意儿...

这里的生命周期有init和destroy钩子，可以在bean里面bind，
欸，这个bean.xml写的越来越像vue了呢，又是传参又是事件钩子函数的。😋

bean之间也是可以设置parent属性“继承”其他bean的，不过只是属性继承，比如可以用一个bean作为模板，统一其他类似的bean的参数。但是它们的类实例没有java的继承关系。

总之就是template的味道，如果不放心自己会不会乱写，可以给模板的bean加上abstract属性

工厂模式和工厂bean：
关键属性：factory-bean，factory-method
关键概念：工厂bean的实例，工厂bean生产的bean实例

注解开发bean

要求：上下文获取：

``` java
ApplicationContext context = new AnnotationConfigApplicationContext();
```

配置类：使用@Configuration标识
配置类里面可以产生bean方法：@Bean("bean_name")，也可以：@Bean(name = "", initMethod = "", destroyMethod = "", autowireCandidate = false)

还可以：

```java
@Bean
@Lazy(true)     //对应lazy-init属性
@Scope("prototype")    //对应scope属性
@DependsOn("teacher")    //对应depends-on属性
public Student student(){
    return new Student();
}
```

需要构造参数的：

``` java
@Configuration
public class MainConfiguration {
    @Bean
    public Teacher teacher(){
        return new Teacher();
    }

    @Bean
    public Student student(Teacher teacher){
        return new Student(teacher);
    }
}
```

引入其他配置类：在@Configuration前：@Import(OtherConfiguration.class)

@AutoWire，可以在字段上，也可以在setter或者构造器上默认byType，如果有多个类型，可以通过在下面加一个
@Qualifier("bean_name")指定

@Resource也可以替代Autowire，但是有些版本需要额外包：

``` xml
<dependency>
    <groupId>jakarta.annotation</groupId>
    <artifactId>jakarta.annotation-api</artifactId>
    <version>2.1.1</version>
</dependency>
```

听说IDEA推荐？Resource。。。默认byName，其次会byType，可以在setter和字段，而Auto wire在字段set构造器方法参数都可以

可以给方法加上PreDestory和PostConstruct注解，也就是destroy和init的注册

这些注解都是JakartaEE提供的。。

然后我们发现这样也不方便，@Bean虽然解耦但是还是要我们自己new一个出来

于是我们可以在类上面加@Component注解，注解可以设置name，没有设置就以小驼峰命名的类名作为默认名

但是这个Component仅仅标识，我们还需要一个配置类（通过@Configuration标识），并为配置类添加
@ComponentScan设置Component的自动扫描范围

当然，这个@Component虽然方便，但是只是对我们自己写的业务类方便，
对于一些第三方包的Bean还是只有之前的方式来配置更方便

@Component注入时，如果Bean的的构造参数不是无参，会对每个参数都进行注入，
@Component也适用于工厂模式

XML和注解配置各有优缺点，可以混合用

## 高级特性补充

### Bean Aware

Spring给了一些以Aware结尾的接口，相当于又给了一坨生命周期钩子接口

### 异步方法

在类上要@EnableAsync
在需要异步的方法上@Async，默认会在调用时多开一个线程来执行多线程任务，如果没法多线程会用SimpleAsyncTaskExecutor
原理：Spring给我们类做了一层代理，源码都改了。后面讲

### 定时器

@EnableScheduling 在类上
@Scheduled，可以添加如下参数：

- fixedDelay：在上一次定时任务执行完之后，间隔多久继续执行。
- fixedRate：无论上一次定时任务有没有执行完成，两次任务之间的时间间隔。
- cron：如果嫌上面两个不够灵活，你还可以使用cron表达式来指定任务计划。

这里简单讲解一下cron表达式：[!https://blog.csdn.net/sunnyzyq/article/details/98597252]

### 监听器

写前端写事件监听都熟悉吧，不过Spring不咋用这个

### spel

springExpressionLanguage

SpEL 是一种强大，简洁的装配 Bean 的方式，它可以通过运行期间执行的表达式将值装配到我们的属性或构造函数当中，更可以调用 JDK 中提供的静态常量，获取外部 Properties 文件中的的配置。
