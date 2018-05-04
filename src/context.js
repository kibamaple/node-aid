const {entries,keys} = Object;

function context(params,ctx){
    let _ctx = {},
        key,value,name,obj;
    for([key, value] of entries(params))
        for(name of value)
            if((obj = ctx[key]) && obj.hasOwnProperty(name))
                _ctx[name] = obj[name];
    return _ctx;
}

exports.koa = (app,ctx)=>{
    const {query,request:{body}, state} = ctx,
        {$params} = app,
        params = $params 
            || {
                query:keys(query),
                body:keys(body),
                state:keys(state)
            };
    return context(
        params,
        {query,body,state}
    );
}