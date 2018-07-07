const Crypto = require('crypto'),
    Querystring = require('querystring'),
    Handlebars = require('handlebars'),
    Is = require('./is'),
    Util = require('util');

const {ENV} = process.env,
    URL = 'https://openapi.alipay.com/gateway.do',
    TRADE_SUCCESS = 'TRADE_SUCCESS',
    TRADE_FINISHED = 'TRADE_FINISHED',
    TRADE_CLOSED = 'TRADE_CLOSED',
    RSA2 = 'RSA2',
    RSA_SHA256 = 'RSA-SHA256',
    RSA_SHA1 = 'RSA-SHA1',
    UTF8='utf8',
    BASE64 = 'base64',
    PARAM_FORMAT = '%s=%s',
    AND = '&',
    EXLCUDES = ['sign','sign_type'],
    {entries,assign} = Object,
    {format} = Util,
    {createSign,createVerify} = Crypto,
    {stringify} = JSON,
    {string,number,array,fn} = Is,
    {parse} = Querystring,
    {compile} = Handlebars,
    render = compile('<form id="alipay" name="alipay" action="'+URL+'" method="post" accept-charset="{{params.charset}}" onsubmit="document.charset=\'{{params.charset}}\';">\n{{#each params as |value key|}}\n<input name="{{key}}" type="hidden" value="{{value}}" />\n{{/each}}\n</form>\n<script>document.forms[\'alipay\'].submit();</script>'),
    _exports = {TRADE_SUCCESS,TRADE_FINISHED,TRADE_CLOSED};

function doSign (content,key,type,encoding){
    const sha = type === RSA2
        ?createSign(RSA_SHA256)
        :createSign(RSA_SHA1);
    sha.update(content, encoding);
    return sha.sign(key, BASE64);
}

function doVerify (content,sign,key,type,encoding){
    const sha = type === RSA2
        ?createVerify(RSA_SHA256)
        :createVerify(RSA_SHA1);
    sha.update(content, encoding);
    return sha.verify(key,sign,BASE64);
}

function buildContent(params,transform,excludes=[]){
    const keys = [],_params=[],ctx={};
    for(let [k,v] of entries(params)){
        if(
            v === undefined || v === null 
            || (array(excludes) && excludes.includes(k))
        )
            continue;
        keys.push(k);
    }
    keys.sort();
    let k,v,p,t;
    for(k of keys){
        v = params[k];
        if(number(v))
            p = v.toString();
        else if(string(v))
            p = v;
        else
            p = stringify(v);
        ctx[k] = t = fn(transform)?transform(p):p;
        _params.push(format(PARAM_FORMAT,k,t));
        
    }
    return [_params.join(AND),ctx];
}

_exports.build = buildContent;

_exports.request = (params,key,encoding=UTF8)=>{
    const {sign_type} = params,
        [content,ctx] = buildContent(params),
        sign = doSign(content,key,sign_type,encoding);
    return render({params:assign({},ctx,{sign})});
}

_exports.notify = (body,key,encoding=UTF8)=>{
    const params = parse(body),
        {sign_type,sign} = params,
        [content,ctx] = buildContent(params,undefined,EXLCUDES);

    return doVerify(content,sign,key,sign_type,encoding)?assign(ctx,{sign_type,sign}):undefined;
}

module.exports = _exports;