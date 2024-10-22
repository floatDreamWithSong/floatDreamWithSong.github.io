# Java 后端汇总

网上搞很多的飞机啊什么的，人都迷糊了，我先写一篇理清楚后端到底要搞什么。
首先总的来说一句，这就是跟前端差不多的各种包管理接入，但是生态更奇怪...

## 基础知识

Java核心，SQL，这些都不消说。
SQL练习[!http://sqlmother.yupi.icu/#/learn]

## Spring

Spring 其实是一个轻量应用级框架，而不是专门为web应用设计的。
Spring 在于 DI，Ioc 和 Aop 等思想，这一坨也属于Spring Core。

## SpringMVC

这个就是专门为Web设计的开发框架，采用视图（不过现在视图层主要都给前端了），控制器（请求控制，权限控制等），模型（业务）

## Mybatis

这个是对于使用数据库专门设计的框架，作为持久层，数据库这一块的开发框架

## Spring SSM

SSM = Spring + SpringMVC + Mybatis,也就是说将前三者，MVC提供了请求管控和接入，Spring 强化了整个项目的架构，Mybatis简化和数据库的互动。
如此可以比较方便的进行Web开发

## Spring Boot

就是属于快速集成SSM，更快开发，约定大于配置。

## 对比一下前端

我是从前端转过来的，对比一下，就仿佛：（不那么贴切的）
Spring 相当于Vue/React等应用级框架
SpringMVC 就如 axios，对请求操作进行控制的框架
Mybatis 就如 Redux/VueX,Pinia这类（虽然是全局状态库），或者对IndexDB进行了封装的库
集成上面三者的前端项目相当于SSM
Spring Boot相当于一个quick start，否则你创建项目就像：
初始化项目，填写package.json，添加依赖文件，安装依赖，设置各种.config.ts，运行命令配置...
就比较麻烦，quick start 就集成好了，直接从基础配置模板上开始开发

## Spring Security

各种安全认证啦，前端肯定也搞过类似的

## Spring Cloud

微服务这一块，普通人很难做这一块的项目的啦，成本太高。
前端也由微前端，但是，说实话，真的很少有项目的体量大到需要微前端来拆分业务的，
微服务的需求比微前端的需求跟高，毕竟把基础服务分布到更广的地方是业务的需求之一。
前端，搓一下项目工具，如果不是有专门的需求，根本碰不到这一类。还是学英语吧😭。

## 中间件

> 中间件就是来降低业务复杂性，解耦的，你看计算机网络模型分那么多层就是为了这个目的，如果什么问题是中间件解决不了的，就再加一层...
后端中间件是指位于操作系统和应用程序之间的软件，它们提供了一种通信机制，使不同的应用程序或系统能够相互交互和协作。以下是一些常见的后端中间件类型及其代表产品：

有哪些中间件

1. **消息队列中间件**：用于在应用程序之间进行异步消息传递。
   - Apache Kafka
   - RabbitMQ
   - ActiveMQ
   - RocketMQ

2. **数据库中间件**：用于管理和访问数据库。
   - MySQL Proxy
   - PostgreSQL PgBouncer
   - ShardingSphere

3. **缓存中间件**：用于加速数据访问，减轻数据库负载。
   - Redis
   - Memcached

4. **Web服务器中间件**：用于处理HTTP请求和响应。
   - Nginx
   - Apache

5. **应用服务器中间件**：用于托管和管理应用程序的执行环境。
   - Tomcat
   - Jboss
   - WebLogic
   - WebSphere

6. **API网关中间件**：用于管理和控制API的访问和调用。
   - Kong
   - Apigee

7. **配置中心**：用于集中管理配置信息。
   - Apollo
   - Nacos
   - Spring Cloud Config

8. **服务框架**：用于构建微服务架构。
   - Dubbo

9. **监控中间件**：用于监控系统的状态和资源使用情况。
   - Nagios
   - Zabbix

10. **日志中间件**：用于记录和管理日志信息。
    - Elasticsearch
    - Logstash
    - Fluentd
    - Graylog

11. **事务中间件**：用于处理分布式事务。
    - Java事务API（JTA）
    - Microsoft分布式事务协调器（MSDTC）

12. **安全中间件**：提供安全性功能，如身份验证、授权、加密和访问控制。
    - OAuth
    - OpenID Connect

13. **搜索中间件**：用于构建搜索功能和实现全文搜索。
    - Elasticsearch
    - Apache Solr

14. **虚拟化中间件**：提供虚拟化技术，将物理资源抽象为虚拟资源。
    - VMware
    - KVM

15. **流程中间件**：用于管理和协调业务流程和工作流程。
    - Activiti
    - Camunda
