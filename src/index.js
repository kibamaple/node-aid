const Context = require('./context'),
    Handle = require('./handle'),
    Is = require('./is'),
    JS = require('./js'),
    Promisify = require('./promise'),
    Route = require('./route'),
    Table = require('./table'),
    View = require('./view');

const {search:route} = Route,
    {koa:handle} = Handle,
    {koa:context} = Context,
    {koa:view} = View;

function koa (ctrl,...views) {
    const r = route(ctrl),
        v = view(true);
    return handle(r,context,...views,v);
}

module.exports={
    Context,Handle,Is,JS,Promisify,Route,Table,View,
    koa
}