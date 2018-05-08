# AID Library (辅助库)
一个应用开发辅助库。提供搭建简易业务逻辑代码执行组件(中间件)，独立于外层其他框架(koa,express,socket等其他应用环境框架)，方便将逻辑代码接入不同的外层框架。
也支持常用的函数方法，简化代码（如：数据集合处理）

### 获取库
> npm install node-aid

### 使用
koa挂载组件：
```js
const Koa = require('koa'),
    Path = require('path'),
    Aid = require('node-aid'),
    {join} = Path,
    {koa,View,Route} = Aid,
    {koa:route} = Route,
    {koaRoute:view} = View;

const PORT = process.env.PORT || 80,
    app = new Koa(),
    ctrlPath = join(__dirname,'ctrl'),//业务代码目录
    viewPath = join(__dirname,'view');//视图代码目录
    viewRoute = route(viewPath);//视图路由

// 挂载组件
app.use(koa(ctrl,view(route))); 
// 如下,只简单respond，不使用视图处理
// app.use(koa(ctrl));

app.listen(PORT);
```
业务逻辑：(.../ctrl/xxx.js)
```js
const Schema = require('../schema/schema'),
    Model1 = require('../model/model1'),
    Model2 = require('../model/model2');

const {validateP1,validateP2} = Schema;

// 可以使用async,promise及普通函数
exports.post = async ({p1,p2})=>{

    const vp1 = await validateP1(p1),
        vp2 = await validateP2(p2);
    
    // 格式检查
    // status 400
    // body {p1:true,p2:fasle}
    if(!(vp1 && vp2))
        return [400,{p1:vp1,p2:vp2}]; 

    // 业务判断，返回给xxx视图代码处理
    // status 由xxx视图设置
    // body 由xxx视图设置
    const contain = await Model1.contain(p1);
    if(!contain)
        return ['xview',{contain},{p1,p2}]
    
    const table = await Model2.query(p2);
    // 正常响应
    // status 200
    // body {table:...}
    return [undefined,{table}];
}
```
视图处理：(.../view/xview.js)
```js
// 可以使用async,promise及普通函数
exports.post = (ctx,body,params)=>{
    ctx.status = 404;
    ctx.body = body;
    // 中止调用后续next
    return true;
}
```
请求
```shell
curl -H "Content-Type:application/json" -X POST --data '{"p1":123,"p2":"p2"}' http://host:port/xxx
```
### API
***
##### Handle执行流程
* `aid.koa`(ctrl,...views) 基于koa构建执行流程
* `aid.Handle.koa`(route,context,...views) 构建执行流程
* `aid.Route.search`(dirname) 目录下功能模块路由
* `aid.Context.koa`模块功能参数构建
* `aid.view.koa`(complete) 简易视图，响应返回json
  * `complete = true` 完成响应，中止后续执行。
* `aid.view.koaRoute`(route)视图路由，指定特定视图处理模块响应。
##### Is变量类型判断
* `aid.Is.string`
* `aid.Is.object`
* `aid.Is.array`
* `aid.Is.base64`
* `aid.Is.number`
* `aid.Is.boolean`
* `aid.Is.integer`
* `aid.Is.fn`
* `aid.Is.regexp`
* `aid.Is.hex`
* `aid.Is.date`
* `aid.Is.undef`
* `aid.Is.defined`
* `aid.Is.error`
##### Data数据处理
* `aid.Table.count` 获取数据集数量
* `aid.Table.check`(number) 效验数据集数量
* `aid.Table.empty` 效验空数据集
* `aid.Table.search`(index) 获取指定行数据
* `aid.Table.top` 获取首行数据
* `aid.Table.match`(col) 获取指定列数据
* `aid.Table.get`(row,col) 获取指定数据单元
* `aid.Table.first`(col) 获取首行数据单元
##### 其他
* `aid.Promise.promisify`(fn) 回调函数转Promise函数