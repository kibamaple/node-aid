const Is = require('./is');
const {undef,object} = Is,
    {entries} = Object;

function $mapping(params,ctx){
    let _ctx = {},
        key,value,name,obj;
    for([key, value] of entries(params))
        if(object(obj = ctx[key]))    
            for(name of value)
                if(obj.hasOwnProperty(name))
                    _ctx[name] = obj[name];
    return _ctx;
}

function $get (key,...args) {
    let value,arg;
    for(arg of args)
        if(arg.hasOwnProperty(key)){
            value = arg[key];
            break;
        }
    return value;
}

exports.koa = (app,ctx)=>{
    const {query,request:{body},state} = ctx,
        {$params} = app;
    return undef($params)?new Proxy(
        {},
        {get:(target,key)=>$get(key,target,state,body,query)}
    ):$mapping(
        $params,
        {query,body,state}
    );
}