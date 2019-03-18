# visilabs-widget


## HTML TEMPLATE

> liste, fiyat, inidirim oranı için burada script template tanımlanır. Tanımlanmazsa default değerlerini alır

```HTML
<script id="visTemplateList" type="text/template">
    <li class="ems-prd swiper-slide {{class}}" data-prdcode="{{prdcode}}">

        <div class="product">

            <div class="productInner">

                <div class="prdImg"><img src="/images/front-end/urunlist.png"><a href="{{uri}}"> <img class="lazyload" src="/images/lazyload/placeHolder.gif" data-original="{{src}}" alt="{{title}}" title="{{title}}"> </a> </div>

                <div class="prdPrice clearfix">{{discountWrp}} {{urunListe_brutFiyat}}{{urunListe_satisFiyat}}</div>

                <div class="prdName"><a href="{{uri}}" title="{{title}}">{{title}}</a></div>

                <hr class="floatFixer">

            </div>

        </div>

    </li>

</script>

<script id="visTemplatePrice" type="text/template">

<div class="{{class}}">{{price}}<span class="d">{{decimals}}</span><span class="pb1"> {{currency}}</span></div>

</script>

<script id="visTemplateDiscount" type="text/template">

<div class="prdStatus"><div class="urunListe_pnlIndirimOran"><span class="urunListe_IndirimOran">%{{discount}}</span></div></div>

</script>

```

## CONFIG

> config dosyası

```HTML

<script type="text/javascript">

var VIS_WIDGET_CONFIG = [

        /* ANASAYFA */

        { mdl: 'widget-zone-3', zoneid: 3, target: '.widget-zone-3-man', typ: 'catCode' }, /* ERKEK */

        { mdl: 'widget-zone-3', zoneid: 3, target: '.widget-zone-3-women', typ: 'catCode' }, /* KADIN */

        { mdl: 'widget-zone-3', zoneid: 3, target: '.widget-zone-3-boys', typ: 'catCode' }, /* ERKEK ÇOCUK */

        { mdl: 'widget-zone-3', zoneid: 3, target: '.widget-zone-3-girls', typ: 'catCode' }, /* KIZ ÇOCUK */

        /* ÜRÜN LİST */

        { mdl: 'widget-zone-1', zoneid: 1, target: '.widget-zone-1', typ: 'catCode' },

        /* ÜRÜN DETAY */

        { mdl: 'widget-zone-2', zoneid: 2, target: '.widget-zone-2', typ: 'prdCode' },

        /* SEPET */

        { mdl: 'widget-zone-4', zoneid: 4, target: '.widget-zone-4', typ: 'catCode' }

    ];

</script>

<script type="text/javascript" src="/upload/js/visilabs-widget.js"></script>


```
