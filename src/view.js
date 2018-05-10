const Is = require('./is');
const {fn,integer} = Is;

exports.koa = (res)=>{

    return (ctx,[status,body])=>{
        if(!status || integer(status))
            ctx.status = status || 200;
        ctx.body = body;
        return res;
    };

}

exports.koaRoute = (route)=>{

    return async (ctx,[view,...opts])=>{
        const {method} = ctx,
            action = await route(view,method);
        if(fn(action))
            return await action(ctx,...opts);
    };

}