const render = jest.fn(),
    compile = jest.fn(()=>render),
    {assign} = Object,
    opts = {virtual: true},
    Private_Key = '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCXenhmkwoL3xSt\nHCz7SfgBUf/OVU3bRGhOLHyIhqsQn/nKxwIOc9Sf6bK3oQQfzgH1Opmvuawf3dMk\nA5yk4tS+sE8H9H4N3zAhggAVDykMRUloOzDE6Z1qO/83061tVU3TIs4gROu/cubs\nx5rs9qbmu1tUvmFsCktlfIC+rvPTMg02WRk49CzTfYH3oxtuAfigiBXF7NojgH/G\nZEv4twhA3B71E0rtnN0jBqoSBEzOR/AFzLtB9EvBtJn4NFqJbenHWPpVfg7OV79B\nzWclzAOw7RvEZlk+nOx8a9BZxOX2tW29Mg0JArv4jusfq6Lv6HCW2WfZ4AE1KDNp\n4Lv1RfIzAgMBAAECggEAeQ3gpmifwLj4dxdrQy7ryXJUcfpuC+rxSHf41cp5bwHJ\nyCmeFRqwM1O6BVHiT+B8ZBP+uhYx3g2SLNfOGV9FEVco8XyMOF3CwyR3GF1TOoEs\nluWmpdbke/+SiHTbxeJEHZVVESjDFe6naVZjEzhSTVYxONokVQktE9+Zq8l5Ba9h\nZXfO6H3ouus5ByCnxsV0eQEuGHVUzSM7Mscy3VjUT4Y8n38kvO+lINkxC+CdOvrY\nX04lq62n98SG2ZdW3vcbX/N1qA+7LG0js30OkGIwnlRbfSOfThc+LTe+yju5AYBc\nTzUm72Rd29CIuIEf9EmhKMjU5LsitoHLC/hVeZl44QKBgQDHi6VYU/lQfjCapzu6\nakRG96zaRbaL8QME120pGqHuGxomXGnT5lwuHp1vrzrVzwFWCpvTK8cDWPrw7S9N\nUeKH0yY3+pmrzktzMDkp2+49sDObYUuiEq9Br2xxvJi8HprqXCBQTKyPs/jWrxgi\nhQaBzNazlwi29W3U5A2ovbJqSQKBgQDCVX/zEAdbplUlFf6lXD7WKQx3zMyD0MBJ\nY7Jf6jw8jAUmYz923xx2vryvWT9WJv6iiMqlgRQ6pcNf3sr7GdD0pSCO+b4oOh/y\nKr0GIs7hQ96/lKSVAaUrET46bIQAzJc5fFY04M3Ntw84L1e9WmwMb+0cYr/KqAil\nhp6P3ALYmwKBgEnZ3gztr0TiHxztrcZVVAWr3pY93My4GzTsgeMHj0yvTSNLaoNZ\nK16KSBwwjybYYRc1/+vMtPABO4Z1Ud9c4ekA9ZEcN0mFpRjxjQZ39hlwn/jurm5C\nWgiGYy1I7oIZFZ6NEAyIBAl/QyY5UUZdU0YwyHlY+Ym1FbwH1yJParu5AoGAWzAD\neepriXXjPiOz+aPvWE6qqwxOawvpLoa5jIg8+6w4PmsTvJO0p4OYxi76qVJi6aGG\ndWK8O0jNBI9mb60Nf758KJrHv9iGZPvo9pgeu1U9kGgPUlwTRMIykPeaeUWHMFJH\noUhbScw8OAD/CrsDOFLM0CUGGfH/HKyuepKiQ0ECgYByHTcOJbcTKkQEBYWLkU0B\niIN7W1g8QRT0fvT0s1pzvNreYQC9Ndo3Nu8PVXH4r8Fs0NnwiKgVlkKmJLTzJIIM\nlpoA8g8iKh8dDKIXooeI6CZCNSNVLuyuupMm5h+1EWzvYs4U+5TRwm3Gijo5yBwn\nuHUBg0eZ0nwSbkmprb4+SA==\n-----END PRIVATE KEY-----\n',
    Public_Key = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAl3p4ZpMKC98UrRws+0n4AVH/zlVN20RoTix8iIarEJ/5yscCDnPUn+myt6EEH84B9TqZr7msH93TJAOcpOLUvrBPB/R+Dd8wIYIAFQ8pDEVJaDswxOmdajv/N9OtbVVN0yLOIETrv3Lm7Mea7Pam5rtbVL5hbApLZXyAvq7z0zINNlkZOPQs032B96MbbgH4oIgVxezaI4B/xmRL+LcIQNwe9RNK7ZzdIwaqEgRMzkfwBcy7QfRLwbSZ+DRaiW3px1j6VX4Ozle/Qc1nJcwDsO0bxGZZPpzsfGvQWcTl9rVtvTINCQK7+I7rH6ui7+hwltln2eABNSgzaeC79UXyMwIDAQAB\n-----END PUBLIC KEY-----\n';

describe('alipay',()=>{
    let $alipay;

    beforeAll(()=>{
        jest.doMock('handlebars',()=>({compile}),opts);
        $alipay = require('@/alipay');
    });

    afterAll(()=>{
        jest.dontMock('handlebars');
        jest.resetModules();
    });

    afterEach(()=>{
        render.mockReset();
        compile.mockClear();
    });

    it('request',()=>{
        const {request} = $alipay,
            res = Symbol();

        render.mockReturnValueOnce(res);
        const data = {
            body:'内容',
            subject:'标题',
            out_trade_no:'201806071234567890',
            total_amount:1.01,
            product_code:'QUICK_WAP_WAY'
        },
        params = {
            app_id:'2014072300007148',
            biz_content:JSON.stringify(data),
            charset:'utf-8',
            method:'alipay.trade.wap.pay',
            notify_url:'http://node-aid/notify.html',
            return_url:'http://node-aid/return.html',
            sign_type:'RSA2',
            timestamp:'2018-06-07 00:00:00',
            version:'1.0'
        },
        _params = assign({},params,{sign:'OP71hTI9D9+8DV73bljEFutx8LsXN/I+HojwRFdr7hgbNO6ZC9nuDBKpMw4EwaXZgrHxQodkMpXdFc54F+/2AM856s+xkgMB7opZ73PfK3l6Y7Yqly6GoKwoSHaFttNxW2K2ORWCb01zZB9vsgj6YteFriVPi7amRfN8jUsQBzhHnpVUqogH7304XtWaJfZcH0vtbI8Or2MueE1SP8IvnArejvsEWuJyMNeDbfaiW5+i/EE2C7lwAhlnm62uFv6vVaYDoUitcD2Ea7btV4v0UPNuqGFZPRoqWyzB/xBAvkz8LaJsLTbheJ10e/RR8G+Vf1z8Xn0j/kk8sksnWrCmLQ=='});

        expect(request(params,Private_Key)).toBe(res);
        expect(compile).toHaveBeenCalledTimes(1);
        expect(render).toHaveBeenCalledTimes(1);
        expect(render).toHaveBeenCalledWith({params:_params});
    });

    it('notify',()=>{
        const {notify} = $alipay;
        const body = 'app_id=2014072300007148&charset=utf-8&sign_type=RSA2&notify_id=ac05099524730693a8b330c5ecf72da9786&notify_time=2018-06-07%2000%3A00%3A00&notify_type=trade_status_sync&out_trade_no=201806071234567890&sign=krrg%2FA2VP3nskl0V%2FSdEMHYV%2FD94Bsm5wn5d3wGgAnwE2n2NYC9b9ATQZURMAlvPqjNw1zZbkji%2BFbHFXla5O97T%2FJrUULoxL8eSYZY%2FMqeqW3wCQr8mnqvxnbTw240rHH6gbTsG0YT6sIftkdgpFT3t9jgNeXRxe7NlPpw%2BMAWD7STVFubeBpWPEfuOfN9%2Ba%2FZOJTgvh1WDCMRQ8kt61utokkRie3H5HQtKlBHR%2BfvMNI58ShE7fFrYQVpOBngCDAH%2BbRUOqvKmK2J8M7hDIjamTQpBYlyfrZR0jPA%2Fs82FMaJU3xDF8FXDQqDPLuRALXy04fHoEL9o%2FLP2%2BfP6fA%3D%3D&total_amount=1.01&trade_no=2018000000011111&trade_status=TRADE_SUCCESS&version=1.0',
            params = {
                notify_time:'2018-06-07 00:00:00',
                notify_type:'trade_status_sync',
                notify_id:'ac05099524730693a8b330c5ecf72da9786',
                app_id:'2014072300007148',
                charset:'utf-8',
                version:'1.0',
                sign_type:'RSA2',
                sign:'krrg/A2VP3nskl0V/SdEMHYV/D94Bsm5wn5d3wGgAnwE2n2NYC9b9ATQZURMAlvPqjNw1zZbkji+FbHFXla5O97T/JrUULoxL8eSYZY/MqeqW3wCQr8mnqvxnbTw240rHH6gbTsG0YT6sIftkdgpFT3t9jgNeXRxe7NlPpw+MAWD7STVFubeBpWPEfuOfN9+a/ZOJTgvh1WDCMRQ8kt61utokkRie3H5HQtKlBHR+fvMNI58ShE7fFrYQVpOBngCDAH+bRUOqvKmK2J8M7hDIjamTQpBYlyfrZR0jPA/s82FMaJU3xDF8FXDQqDPLuRALXy04fHoEL9o/LP2+fP6fA==',
                trade_no:'2018000000011111',
                out_trade_no:'201806071234567890',
                total_amount:'1.01',
                trade_status:'TRADE_SUCCESS'
            };

        expect(notify(body,Public_Key)).toEqual(params);
    });

});