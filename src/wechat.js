const Crypto = require('crypto'),
    Is = require('./is'),
    Request = require('request-promise-native'),
    Xml = require('xml2js'),
    Util = require('util');

const URL = 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    SUCCESS = 'SUCCESS',
    MD5 = 'MD5',
    SHA256 = 'sha256',
    HEX = 'hex',
    KEY = 'key',
    UTF8='utf8',
    PARAM_FORMAT = '%s=%s',
    AND = '&',
    BUILD_OPTIONS = {rootName:'xml',cdata:true,headless:true},
    PARSE_OPTIONS = {explicitArray:false},
    REQUEST_OPTIONS = {method: 'POST',uri:URL,headers:{"Context-Type":"text/xml"}},
    EMPTY = '',
    EXLCUDES = ['sign'],
    {entries,assign} = Object,
    {Parser,Builder} = Xml,
    {format,promisify} = Util,
    {createHash,createHmac} = Crypto,
    {stringify} = JSON,
    {string,number,array} = Is,
    _exports = {URL,SUCCESS};

function doSign (content,key,type,encoding){
    const crypto = type === MD5
        ?createHash(MD5)
        :createHmac(SHA256,key);
    crypto.update(content, encoding);
    return crypto.digest(HEX).toUpperCase();
}

function buildContent(params,key,excludes=[]){
    const keys = [],_params=[];
    for(let [k,v] of entries(params)){
        if(
            v === undefined || v === null 
            || (array(excludes) && excludes.includes(k))
        )
            continue;
        keys.push(k);
    }
    keys.sort();
    let k,v,p;
    for(k of keys){
        v = params[k];
        if(number(v))
            p = v.toString();
        else if(string(v))
            p = v;
        else
            p = stringify(v);

        _params.push(format(PARAM_FORMAT,k,p));
    }
    _params.push(format(PARAM_FORMAT,KEY,key));
    return _params.join(AND);
}

function buildXml(params){
    const builder = new Builder(BUILD_OPTIONS);
    return builder.buildObject(params);
}

function parseXml(xml){
    const parser = new Parser(PARSE_OPTIONS),
        parse = promisify(parser.parseString);
    return parse(xml);
}

_exports.request = async (params,key,encoding=UTF8)=>{
    const {sign_type} = params,
        content = buildContent(params,key),
        sign = doSign(content,key,sign_type,encoding),
        body = buildXml(assign({},params,{sign})),
        res = await Request(assign({},REQUEST_OPTIONS,{body}));
    return res;
}

_exports.notify = async (body,key,encoding=UTF8)=>{
    const {xml:params} = await parseXml(body),
        {sign_type,sign} = params,
        content = buildContent(params,key,EXLCUDES);

    return doSign(content,key,sign_type,encoding) === sign?params:undefined;
}

module.exports = _exports;