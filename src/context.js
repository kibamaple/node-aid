const Is = require('./is');
const {undef,object,fn} = Is,
    {entries} = Object;

function $mapping(params,ctx){
    let _ctx = {},
        key,value,name,obj;
    for([key, value] of entries(params))
        if(object(obj = ctx[key]))    
            for(name of value)
                if(
                    !_ctx.hasOwnProperty(name) 
                    && obj.hasOwnProperty(name)
                )
                    _ctx[name] = obj[name];
    return _ctx;
}

function $get (key,target,...args) {
    let value,arg;
    if(!target.hasOwnProperty(key)){
        for(arg of args)
            if(
                object(arg)
                && fn(arg.hasOwnProperty)
                && arg.hasOwnProperty(key)
            ){
                value = arg[key];
                break;
            }
        target[key] = value;
    }

    return target[key];
}

exports.koa = (app,ctx)=>{
    const {query,request:{fields,files},state} = ctx,
        {$params} = app;
    return undef($params)?new Proxy(
        {},
        {get:(target,key)=>$get(key,target,state,fields,files,query)}
    ):$mapping(
        $params,
        {query,fields,files,state}
    );
}