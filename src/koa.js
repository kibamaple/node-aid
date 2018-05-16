const Context = require('./context'),
    Handle = require('./handle'),
    Is = require('./is'),
    Route = require('./route'),
    View = require('./view');

const {defined,array,object,undef,integer} = Is;

function respond (ctx,status,body,headers,cookies) {
    if (integer(status))
        ctx.status = status;

    if (object(headers))
        ctx.set(headers);

    if (array(cookies))
        for (let args of cookies)
            ctx.cookies.set(...args);

    if (!undef(body))
        ctx.body = body;
}

function viewFn (_) {
    return View(undef(_)?_:Route(_));
}

module.exports = (routes,views) => {

    const rs = routes.map(Route),
        vs = views.map(viewFn),
        handle = Handle(rs,vs);

    return async (ctx,next)=>{

        const {query,request:{fields,files},state} = ctx,
            context = Context(undefined,state,files,fields,query);
        
        let res;
        try{
            res = await handle(ctx,context);
        }catch(e){
            if(e !== ctx)
                throw e;
        }
        
        if(res === null)
            return respond(ctx);
        if(array(res))
            return respond(ctx,...res);
        if(defined(res)){
            const {status,body,headers,cookies} = res;
            return respond(ctx,status,body,headers,cookies);
        }

        return next();
    }
}