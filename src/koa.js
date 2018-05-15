const Context = require('./context'),
    Handle = require('./handle'),
    Is = require('./is'),
    Route = require('./route'),
    View = require('./view');

const {fn,defined,array,object,undef} = Is;

function httpRespond (ctx,status,body,headers,cookies) {
    if (!undef(status))
        ctx.status = status;

    if (object(headers))
        ctx.set(headers);

    if (array(cookies))
        for (let args of cookies)
            ctx.cookies.set(...args);

    if (!undef(body))
        ctx.body = body;
}

module.exports = (routes,views) => {

    const rs = routes.map(Route),
        vs = views.map(Route).map(View),
        handle = Handle(rs,vs);

    return async (ctx,next)=>{
        
        let route,action
        for(route of rs)
            if(fn(action = await route(ctx)))
                break;

        if(fn(action)){
            const {query,request:{fields,files},state} = ctx,
                {$mapping} = action,
                context = Context($mapping,state,files,fields,query);
            let res;
            try{
                res = await handle(ctx,context);
            }catch(e){
                if(e !== ctx)
                    throw e;
            }
            
            if(res === null)
                return httpRespond(ctx);
            if(array(res))
                return httpRespond(ctx,...res);
            if(defined(res)){
                const {status,body,headers,cookies} = res;
                return httpRespond(ctx,status,body,headers,cookies);
            }
        }

        return next();
    }
}
