# Simple Logic Library (简易逻辑库)
一个逻辑开发工具库。可以搭建简易业务逻辑代码执行组件(中间件)，独立于外层其他框架(koa,express,socket等其他应用环境框架)，方便将逻辑代码接入不同的外层框架。
也可以使用库中函数，简化代码（如：数据集合处理）

### 获取库
> npm install sllib

### 使用
koa挂载组件：
```js
const Koa = require('koa'),
    Path = require('path'),
    Sllib = require('sllib'),
    {join} = Path,
    {koa,View,Route} = Sllib,
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
### 模块

##### Context
* `` 逻辑功能参数集合 
* `Handle`  逻辑处理流程
* `Is`  变量类型验证
* `JS`  js相关扩展功能
* `Promisify`  Promise相关扩展功能
* `Route`  路由功能
* `Table`  数组集合相关扩展功能
* `View`  视图功能