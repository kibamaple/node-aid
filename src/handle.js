const Is = require('./is');
const {undef,fn,array,defined} = Is,
    message = 'view not found:';

async function handle (ctx,app,context,...views){
    const param = await context(app,ctx),
        result = await app(param);
    let view,respond;
    for(view of views)
        if(defined(respond = view(ctx,result)))
            break;
    return respond;
}

exports.koa = (context,...views)=>{
    
    return (app)=>{
        if (fn(app)){
            return async (ctx,next)=>{
                const respond = await handle(ctx,app,context,...views);
                if(undef(respond))
                    throw new Error(message+JSON.stringify(data));
                if(fn(respond))
                    return await respond(next);
                if(respond !== true)
                    return await next();
            };
        }
    };
}