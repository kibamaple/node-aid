const Is = require('./is');
const {undef,fn,array,defined} = Is,
    message = 'view not found:';

async function exec (ctx,app,context,...views){
    const param = await context(app,ctx),
        result = await app(param);
    let view,respond;
    for(view of views)
        if(defined(respond = await view(ctx,result)))
            break;
    if(undef(respond))
        throw new Error(message+JSON.stringify(result));
    return respond;
}

exports.koa = (route,context,...views)=>{

    return async (ctx,next) => {
        const {path,method} = ctx,
            app = await route(path,method);
        if(undef(app))
            return next();

        const respond = await exec(ctx,app,context,...views);
        if(fn(respond))
            return await respond(next);
        if(respond !== true)
            return next();
    }

};