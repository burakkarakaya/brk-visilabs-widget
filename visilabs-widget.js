var visilabsTemplateActive = true,
    visilabsActive = false,
    visTemplate = {
        cls: { price: 'urunListe_brutFiyat', discount: 'urunListe_satisFiyat', priceWrp: 'ems-prd-price-first', discountWrp: 'ems-prd-price-selling', indirimli: 'indirimli' },
        template: {
            list: $('#visTemplateList').html() || '<li class="ems-prd swiper-slide {{class}}" data-prdcode="{{prdcode}}"> <div class="product"> <div class="productInner"><div class="prdImg"><a href="{{uri}}"> <img class="lazyload" src="/images/lazyload/placeHolder.gif" data-original="{{src}}" alt="{{title}}" title="{{title}}"> </a> </div><div class="prdPrice clearfix">{{discountWrp}} {{urunListe_brutFiyat}}{{urunListe_satisFiyat}}</div><div class="prdName"><a href="{{uri}}" title="{{title}}">{{title}}</a></div><hr class="floatFixer"> </div></div></li>',
            price: $('#visTemplatePrice').html() || '<div class="{{class}}">{{price}}<span class="d">{{decimals}}</span><span class="pb1"> {{currency}}</span></div>',
            discount: $('#visTemplateDiscount').html() || '<div class="prdStatus"><div class="urunListe_pnlIndirimOran"><span class="urunListe_IndirimOran">%{{discount}}</span></div></div>'
        },
        getPrice: function (o) {
            var _t = this, prc = (o['price'] || '').toString(), htm = '';
            if (prc != '') {
                prc = prc.split('.');
                var price = prc[0] || '',
                    decimals = prc[1] || '';
                if (decimals != '') {
                    if (decimals.length == 1)
                        decimals = decimals + '0';
                    decimals = ',' + decimals;
                }

                htm = _t.template.price.replace(/{{class}}/g, o['cls'] || '').replace(/{{wrpClass}}/g, o['wrpCls'] || '').replace(/{{currency}}/g, o['cur'] || '').replace(/{{price}}/g, price).replace(/{{decimals}}/g, decimals);
            }
            return htm;
        },
        setImg: function (k) {
            return k;
        },
        setUri: function (k) {
            return k;
        },
        getClass: function (o) {
            var _t = this, k = '', prc = o['price'] || '', dPrc = o['dprice'] || '';
            if (prc != dPrc) k = _t.cls['indirimli'];
            return k;
        },
        getDiscount: function (o) {
            var _t = this, k = '', dis = o['discount'] || 0;
            if (dis != 0)
                k = _t.template.discount.replace(/{{discount}}/g, Math.floor(dis)).replace(/{{discountText}}/g, (translation['discountText'] || 'İNDİRİM'));

            return k;
        },
        getTemplate: function (o) {
            var _t = this, prc = o['price'] || '', dPrc = o['dprice'] || '';
            if (prc == dPrc) prc = '';
            return _t.template.list.replace(/{{prdcode}}/g, o['code'] || '').replace(/{{uri}}/g, _t.setUri(o['dest_url'] || '')).replace(/{{src}}/g, _t.setImg(o['img'] || '')).replace(/{{title}}/g, o['title'] || '').replace(/{{urunListe_brutFiyat}}/g, _t.getPrice({ wrpCls: _t.cls['priceWrp'], cls: _t.cls['price'], cur: o['cur'] || '', price: prc })).replace(/{{urunListe_satisFiyat}}/g, _t.getPrice({ wrpCls: _t.cls['discountWrp'], cls: _t.cls['discount'], cur: o['dcur'] || '', price: dPrc })).replace(/{{class}}/g, _t.getClass(o)).replace(/{{discountWrp}}/g, _t.getDiscount(o));
        },
        get: function (o) {
            var _t = this, htm = '', total = o['total'] || 20, begin = o['begin'] || 0;
            $.each(o['data'], function (i, k) {
                if (i >= begin)
                    htm += _t.getTemplate(k);
                if (i == total - 1) return false;
            });

            return htm;
        }
    },
    visFilter = {
        man: function () {
            var arr = [];
            arr.push(new VL_OfferFilter("attribute1", VL_OfferFilterType.Include, "Erkek"));
            return arr;
        }
    },
    visManagement = {
        ajxTarget: '.emosInfinite',
        target: '.swiper-inner',
        arr: VIS_WIDGET_CONFIG,
        cls: { loading: 'ajx-loading', noResult: 'no-result', found: 'results-found', active: 'widget-active' },
        uri: '/usercontrols/kutu/ajxUrunTab.aspx?lang={{lang}}&tip=seciliurun&mdl={{mdl}}&cacheDakika={{cacheDakika}}&ps={{ps}}&rp=1&pcl={{pcl}}',
        getUri: function (o) {
            var _t = this;
            return _t.uri.replace(/{{lang}}/g, lang).replace(/{{mdl}}/g, decodeURI(o['mdl'] || '')).replace(/{{cacheDakika}}/g, decodeURI(o['cacheDakika'] || 30)).replace(/{{ps}}/g, decodeURI(o['ps'] || 100)).replace(/{{pcl}}/g, decodeURI(o['code'] || ''));
        },
        getCode: function (o) {
            var arr = [];
            $.each(o['data'], function (i, k) {
                var code = k['code'] || '';
                if (i >= o['begin'] && code != '') {
                    code = code.substr(code.indexOf('-') + 1, code.length); //kodlar variantlı geldiği için variant kısmını temizlemek amacıyla kullanılacak
                    arr.push(code);
                }
            });

            arr = uty.unique(arr);

            return arr.toString();
        },
        getVariantCode: function () {
            var _t = this,
                code = ($('.urunDetay_urunSecenek1 .selectedOption').text() || '').trim();

            if (code != '')
                code = code + '-' + _t.getPrdCode();
            else
                code = '-' + _t.getPrdCode();

            return code;
        },
        getBrand: function () {
            return ($('.urunKiyaslamaOzellik_ozellik.mrk .urunKiyaslamaOzellik.link_selected').eq(0).find('.urunKiyaslamaOzellik_ozellikImgAd').text() || '').trim();
        },
        getPrdCode: function () { return uty.trimText($('.ems-prd-dtlCode-code').eq(0).text() || ''); },
        getCatCode: function (o) { return $(o['target'] || '').attr('data-catcode') || uty.trimText(minusLoc.get('?', 'kat', urlString)); },
        getSearchText: function () { return uty.trimText(minusLoc.get('?', 'text', urlString)); },
        getCartCode: function () {
            var _t = this, k = '';

            $('.ems-grid-row').each(function (i) {
                var ths = $(this), size = uty.trimText(ths.find('[id$="lblSCD_AD1"]').text() || '').replace(')', '').replace('(', ''), code = uty.trimText(ths.find('.ems-grid-code').text() || '');
                if (code != '')
                    k += ((i > 0 ? '~' : '') + size + '-' + code);
            });

            return k;
        },
        getBasketTotal: function () {
            return uty.getPrc($('.pageSepetToplam_lblSip_NetToplam').eq(0)) || 0;
        },
        getVisilabs: function (o) {
            var _t = this;
            /* vislabs aktifleşince devreye alınacak */
            var vlc = new Visilabs(), _t = this, typ = o['typ'] || '', prm1 = null, prm2 = null, offers = o['offers'] || 'false', filter = o['filter'] || '';
            vlc.AddParameter('json', true);
            if (typ == 'prdCode') prm2 = _t.getPrdCode();
            else if (typ == 'catCode') {
                vlc.AddParameter('cat', _t.getCatCode(o));
                prm1 = 'vlcontent';
            } else if (typ == 'brand') {
                vlc.AddParameter("OM.brand", _t.getBrand());
            } else if (typ == 'searchText')
                prm2 = _t.getSearchText();
            else if (typ == 'cart') {
                prm2 = _t.getCartCode();
                vlc.AddParameter("OM.ba", _t.getBasketTotal());
            } else if (typ == 'variant') {
                prm2 = _t.getVariantCode();
                if (prm2 == '')
                    return false;
            }

            if (filter != '')
                filter = visFilter[filter]() || '';

            vlc.Suggest(o['zoneid'], prm1, prm2, function (d) {
            d = [{ "title": "\nYESIL Polo Yaka Slim T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2004x3006/08/1/011/thumb/L50174284VR027-1_small.jpg", "code": "502030", "target": "_self", "dest_url": "/urun/yesil-polo-yaka-slim-t-shirt--502030.html", "brand": "", "price": "\n69.95 TL", "dprice": "\n119.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": "10", "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nYESIL Polo Yaka Regular T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2004x3006/08/1/011/thumb/L50175748VR027-1_small.jpg", "code": "501741", "target": "_self", "dest_url": "/urun/yesil-polo-yaka-regular-t-shirt--501741.html", "brand": "", "price": "\n79.95 TL", "dprice": "\n159.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nYESIL Polo Yaka Slim T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2004x3006/08/1/011/thumb/L50174292VR079-1_small.jpg", "code": "501965", "target": "_self", "dest_url": "/urun/yesil-polo-yaka-slim-t-shirt--501965.html", "brand": "", "price": "\n59.95 TL", "dprice": "\n89.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nLACIVERT Slim Basic T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2004x3006/08/1/011/thumb/50187188-VR033-erkek-t-shirt-1_small.jpg", "code": "532452", "target": "_self", "dest_url": "/urun/lacivert-polo-yaka-slim-basic-t-shirt-532452.html", "brand": "", "price": "\n59.95 TL", "dprice": "\n89.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nBEYAZ Polo Yaka Slim T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2004x3006/08/1/011/thumb/L50190422VR013-1_small.jpg", "code": "533496", "target": "_self", "dest_url": "/urun/beyaz-polo-yaka-slim-t-shirt-533496.html", "brand": "", "price": "\n59.95 TL", "dprice": "\n119.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nGRI Polo Yaka Slim Basic T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2004x3006/08/1/011/thumb/L50193527VR109-1_small.jpg", "code": "534313", "target": "_self", "dest_url": "/urun/gri-polo-yaka-slim-basic-t-shirt-534313.html", "brand": "", "price": "\n59.95 TL", "dprice": "\n99.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nBEYAZ Regular T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2004x3006/08/1/011/thumb/L50193526VR013-1_small.jpg", "code": "533269", "target": "_self", "dest_url": "/urun/beyaz-regular-t-shirt-533269.html", "brand": "", "price": "\n59.95 TL", "dprice": "\n99.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nSARI Polo Yaka Slim T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2004x3006/08/1/011/thumb/50190422-VR094-erkek-t-shirt-1_small.jpg", "code": "533890", "target": "_self", "dest_url": "/urun/sari-polo-yaka-slim-t-shirt-533890.html", "brand": "", "price": "\n59.95 TL", "dprice": "\n119.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nMAVI Slim Basic T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2004x3006/08/1/011/thumb/50187188-VR045-erkek-t-shirt-1_small.jpg", "code": "531146", "target": "_self", "dest_url": "/urun/mavi-polo-yaka-slim-basic-t-shirt-531146.html", "brand": "", "price": "\n59.95 TL", "dprice": "\n89.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nBEYAZ Polo Yaka Slim Basic T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2004x3006/08/1/011/thumb/L50193527VR013-1_small.jpg", "code": "533856", "target": "_self", "dest_url": "/urun/beyaz-polo-yaka-slim-basic-t-shirt-533856.html", "brand": "", "price": "\n59.95 TL", "dprice": "\n99.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "", "img": "", "code": "", "target": "_self", "dest_url": "", "brand": "", "price": "", "dprice": "", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nYESIL Polo Yaka Slim Basic T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2178x3006/08/1/011/thumb/L50167216VR090-1_small.jpg", "code": "496591", "target": "_self", "dest_url": "/urun/erkek-t-shirt-496591.html", "brand": "", "price": "\n59.95 TL", "dprice": "\n89.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nSARI Polo Yaka Regular Basic T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2178x3006/08/1/011/thumb/L50167268VR094-1_small.jpg", "code": "495684", "target": "_self", "dest_url": "/urun/erkek-t-shirt-495684.html", "brand": "", "price": "\n59.95 TL", "dprice": "\n89.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nLACIVERT Polo Yaka Slim Basic T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2004x3006/08/1/011/thumb/L50172325VR059-1_small.jpg", "code": "501251", "target": "_self", "dest_url": "/urun/lacivert-polo-yaka-slim-t-shirt-basic-.html", "brand": "", "price": "\n59.95 TL", "dprice": "\n89.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nYESIL Bisiklet Yaka Slim T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2004x3006/08/1/011/thumb/L50167154VR093-1_small.jpg", "code": "501178", "target": "_self", "dest_url": "/urun/yesil-bisiklet-yaka-slim-t-shirt--501178.html", "brand": "", "price": "\n39.95 TL", "dprice": "\n49.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nLACIVERT Polo Yaka Slim T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2004x3006/08/1/011/thumb/L50185625VR033-1_small.jpg", "code": "533201", "target": "_self", "dest_url": "/urun/lacivert-polo-yaka-slim-t-shirt-533201.html", "brand": "", "price": "\n69.95 TL", "dprice": "\n139.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nBEYAZ Bisiklet Yaka Regular T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2004x3006/08/1/011/thumb/L50178866VR013-1_small.jpg", "code": "500431", "target": "_self", "dest_url": "/urun/beyaz-bisiklet-yaka-regular-t-shirt--500431.html", "brand": "", "price": "\n39.95 TL", "dprice": "\n59.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nMAVI Polo Yaka Regular Basic T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2004x3006/08/1/011/thumb/L50172324VR045-1_small.jpg", "code": "532479", "target": "_self", "dest_url": "/urun/mavi-polo-yaka-regular-basic-t-shirt-532479.html", "brand": "", "price": "\n59.95 TL", "dprice": "\n89.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nYESIL Polo Yaka Slim T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2004x3006/08/1/011/thumb/L50199406VR054-1_small.jpg", "code": "534556", "target": "_self", "dest_url": "/urun/yesil-polo-yaka-slim-t-shirt-534556.html", "brand": "", "price": "\n89.95 TL", "dprice": "\n179.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nMAVI Polo Yaka Slim T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2004x3006/08/1/011/thumb/L50185805VR102-1_small.jpg", "code": "530647", "target": "_self", "dest_url": "/urun/mavi-polo-yaka-slim-t-shirt-530647.html", "brand": "", "price": "\n69.95 TL", "dprice": "\n129.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }, { "title": "\nBEYAZ Polo Yaka Slim T-Shirt\n", "img": "https://img-uspoloassn.mncdn.com/UPLOAD/PRODUCT_NEW/2004x3006/08/1/011/thumb/50199473-VR013-erkek-t-shirt-1_small.jpg", "code": "534384", "target": "_self", "dest_url": "/urun/beyaz-polo-yaka-slim-t-shirt-534384.html", "brand": "", "price": "\n69.95 TL", "dprice": "\n139.95 TL", "cur": "TL", "rating": 0, "comment": 12, "discount": null, "dcur": "TL", "freeshipping": false, "samedayshipping": true, "attr1": "", "attr2": "", "attr3": "", "attr4": "", "attr5": "", "attr6": "", "attr7": "", "attr8": "", "attr9": "", "attr10": "" }];

            if (d.length > 0) {

                if (offers == 'true') {
                    var arr = [];
                    $.each(d, function (i, k) {
                        var ofr = k.offers || '';
                        if (ofr != '')
                            $.each(ofr, function (j, n) {
                                arr.push(n);
                            });
                    });
                    d = arr;
                }

                if (visilabsTemplateActive) {
                    o['data'] = d;
                    _t.addVisTemplate(o);
                } else {
                    o['code'] = _t.getCode({ data: d, begin: o['begin'] || 0 }) || '';
                    o['data'] = d;
                    _t.add(o);
                }
            }
            }, null, filter);
        },
        addVisTemplate: function (o) {
            var _t = this, target = $(o['target'] || ''), targetAppend = o['targetAppend'] || '.emosInfinite';
            target
                .addClass(_t.cls['found'])
                .addClass(_t.cls['active'])
                .find(targetAppend)
                .html(visTemplate.get({ data: o['data'], total: o['total'] || 20, begin: o['begin'] || 0 }));

            o['ID'] = target;
            _t.initPlugins(o);
        },
        add: function (o) {
            var _t = this, uri = _t.getUri(o), target = $(o['target'] || '');
            target.addClass(_t.cls['loading']);
            uty.ajx({ uri: uri }, function (d) {
                if (d['type'] == 'success') {
                    var e = $('<div>' + d['val'] + '</div>').find(_t.ajxTarget), li = $('> li', e);
                    if (uty.detectEl(li)) {
                        var targetAppend = o['targetAppend'] || _t.target;
                        target
                            .addClass(_t.cls['found'])
                            .addClass(_t.cls['active'])
                            .find(targetAppend)
                            .html('<ul class="emosInfinite ems-inline swiper-wrapper">' + uty.clearScriptTag(e.html()) + '</ul>');

                        _t.changeLink(o);
                        _t.initPlugins({ ID: target });
                    } else
                        target.addClass(_t.cls['noResult']);
                }
                target.removeClass(_t.cls['loading']);
            })
        },
        changeLink: function (o) {
            var _t = this, ID = $(o['target'] || ''), data = o['data'];
            for (var i = 0; i < data.length; ++i) {
                var k = data[i],
                    uri = k['dest_url'],
                    code = k['code'];
                code = code.substr(code.indexOf('-') + 1, code.length);

                var elm = ID
                    .find('.ems-prd-code a[title="' + code + '"]')
                    .parents('.ems-prd')
                    .eq(0);

                if (uty.detectEl(elm))
                    elm
                        .find('.ems-prd-image > a')
                        .attr('href', uri)
                        .end()
                        .find('.ems-prd-sortL > a')
                        .attr('href', uri)
                        .end()
                        .find('.ems-prd-code > a')
                        .attr('href', uri)
                        .end()
                        .find('.ems-prd-name > a')
                        .attr('href', uri);
            }

        },
        initPlugins: function (o) {
            var ID = o['ID'];
            stage.dispatchEvent("CustomEvent", "VISILABS_WIDGET_LOADED", { 'ID': ID });
        },
        init: function () {
            if (visilabsActive) {
                var _t = this, arr = _t.arr;
                setTimeout(function () {
                    for (var i = 0; i < arr.length; ++i) {
                        var o = arr[i], target = $(o['target'] || '');
                        if (uty.detectEl(target))
                            _t.getVisilabs(o);
                    }
                }, 100);
            }
        }
    };

visManagement.init();

stage.addEventListener("CustomEvent", [{ type: "visilabsLoad", handler: "onVisilabsLoad" }]);
function onVisilabsLoad() {
    visilabsActive = true;
    visManagement.init();
}

stage.addEventListener("CustomEvent", [{ type: "VISILABS_WIDGET_LOADED", handler: "onVisilabsWidgetLoaded" }]);
function onVisilabsWidgetLoaded(o) {
    var ID = o['ID'];
    uty.unVeil(ID);
    plugin.slider.set(ID);
    plugin.changeImage.set({ ID: ID.find('.product .productInner .prdImg a'), prop: { defaultImg: '1_small.jpg', changeImg: '2_small.jpg' } });
}