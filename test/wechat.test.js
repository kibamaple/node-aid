const $request = jest.fn(),
opts = {virtual: true},
{assign} = Object,
Key = 'abcdefghijklmn',
xml = '<xml>\n  <appid>wxd678efh567hg6787</appid>\n  <body>套餐一</body>\n  <mch_id>1230000109</mch_id>\n  <nonce_str>5K8264ILTKCH16CQ2502SI8ZNMTM67VS</nonce_str>\n  <notify_url>http://www.weixin.qq.com/wxpay/pay.php</notify_url>\n  <out_trade_no>20150806125346</out_trade_no>\n  <sign_type>MD5</sign_type>\n  <sign>2F7D289AE5400F31A322D3101B358AAB</sign>\n</xml>',
params = {
    appid:'wxd678efh567hg6787',
    body:'套餐一',
    mch_id:'1230000109',
    nonce_str:'5K8264ILTKCH16CQ2502SI8ZNMTM67VS',
    notify_url:'http://www.weixin.qq.com/wxpay/pay.php',
    out_trade_no:'20150806125346',
    sign_type:'MD5'
},
data = assign({},params,{sign:'2F7D289AE5400F31A322D3101B358AAB'});

describe('wechat',()=>{
    let $wechat;

    beforeAll(()=>{
        jest.doMock('request-promise-native',()=>$request,opts);
        $wechat = require('@/wechat');
    });

    afterAll(()=>{
        jest.dontMock('request-promise-native');
        jest.resetModules();
    });

    afterEach(()=>{
        $request.mockReset();
    });

    it('request',async ()=>{
        const {request} = $wechat,
            res = Symbol();
        $request.mockResolvedValueOnce(res);

        expect(await request(params,Key)).toBe(res);
        expect($request).toHaveBeenCalledTimes(1);
        expect($request.mock.calls[0][0].body).toEqual(xml);
    });

    it('notify',async ()=>{
        const {notify} = $wechat;
        expect(await notify(xml,Key)).toEqual(data);
    });

});