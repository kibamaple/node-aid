const Is = require('./is');
const {fn} = Is;

exports.koa = (res)=>{

    return (ctx,[status,body])=>{
        ctx.status = status;
        ctx.body = body;
        return res;
    };

}

exports.koaModule = (route)=>{

    return async (ctx,[view,...opts])=>{
        const {method} = ctx,
            action = await route(view,method);
        if(fn(action))
            return await action(ctx,...opts);
    };

}