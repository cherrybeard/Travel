$(function () {
    var $body = $('body');

    // Выбор класса отеля и питания
    $('.select-checkbox input[type="checkbox"]').change(function (e) {
        var $this = $(this);
        var $parent = $this.parents('.select-checkbox');
        var text = '';
        if (($parent.find('.all').prop('checked')) || ($parent.find('.regular:checked').length == $parent.find('.regular').length)) {
            text = $parent.find('.all').data('value');
        } else {
            $parent.find('.regular:checked').each(function () {
                text += $(this).data('value') + ', ';
            });
            text = text.substr(0, text.length - 2);
        }
        $parent.find('.select-checkbox-text').text(text);
    });

    $('.select-checkbox label').on('click', function (e) {
        e.stopPropagation();
    });


    // Расширенный поиск
    $('.js-search-extend').click(function () {
        $(this).parents('.form-flex').find('.extended')
            .toggleClass('hidden');
        $(this).toggleClass('selected');
    });

    // Выбор даты вылета
    var tomorrow = moment().add(1, 'd'),
        yearLater = moment().add(1, 'y'),
        $dp = $("[data-date]").datetimepicker({
            pickTime: false,
            minDate: tomorrow,
            maxDate: yearLater,
            defaultDate: tomorrow,
            language: 'ru'
        });

    $dp.each(function(){
        var $dtp = $(this).data('DateTimePicker').widget.find(".datepicker");
        $dtp.append($('<label class="date-range"><input type="checkbox" name="datepicker-period" class="hidden datepicker-period"><cite>&plusmn; 3 дня</cite></label>'));
        if ($(this).hasClass('search-date-wrap-small')) {
            $dtp.addClass('datepicker-small');
        }
    });

    var updateDates = function(parent) {
        var $parent;
        if (parent.hasClass('datepicker')) {
            if (parent.hasClass('datepicker-small')) {
                $parent = $('.search-date-wrap-small');
            } else {
                $parent = $('.search-date-wrap-main');
            }
        } else {
            $parent = parent;
        }
        var $datepicker = $parent.data('DateTimePicker'),
            $wrap = $parent.parents('.form-group.when'),
            date = $datepicker.getDate(),
            startsDate = moment(date),
            endsDate = moment(date);

        if ($datepicker.widget.find('.datepicker-period').prop('checked')) {
            $wrap.find('.search-date-period').removeClass('hidden');
            startsDate.subtract(3, 'd');
            endsDate.add(3, 'd');
            if (startsDate.isBefore(tomorrow)) startsDate = moment(tomorrow);
            if (endsDate.isAfter(yearLater)) endsDate = moment(yearLater);
        } else {
            $wrap.find('.search-date-period').addClass('hidden');
        }

        $wrap.find('.search-starts').val(startsDate.format('DD.MM.YYYY'));
        $wrap.find('.search-ends').val(endsDate.format('DD.MM.YYYY'));
    };
    $dp.each(function(){
        updateDates($(this));
    });

    $dp.on('dp.change', function(){
        updateDates($(this));
    });
    $dp.on('dp.show', function () {
        $('.search-resort').removeClass('open');
        $('.js-search-nights-toggle').removeClass('open');
        $('.js-search-child-toggle').removeClass('open');
        $('.js-search-child-toggle button').blur();
        $('.select-checkbox').removeClass('open');
    });
    $body.delegate(".datepicker-period", "change", function(){
        updateDates($(this).parents('.datepicker'));
    });


    // Выбор страны
    $('.js-search-country').on('select2-opening', function () {
        $('.search-resort').removeClass('open');
        $('.js-search-nights-toggle').removeClass('open');
        $('.js-search-child-toggle').removeClass('open');
        $('.select-checkbox').removeClass('open');
        $('.js-search-people-toggle').removeClass('open');
        $dp.data('DateTimePicker').hide();
    });

    $('.js-hotel-name').on('select2-opening', function () {
        $('.search-resort').removeClass('open');
        $('.js-search-nights-toggle').removeClass('open');
        $('.js-search-child-toggle').removeClass('open');
        $('.select-checkbox').removeClass('open');
        $('.js-search-people-toggle').removeClass('open');
        $dp.data('DateTimePicker').hide();
    });


    // Выбор курорта
    $('.js-search-resort').multiselect({
        includeSelectAllOption: true,
        selectAllText: 'Все курорты',
        nonSelectedText: 'Все курорты',
        buttonClass: 'btn btn-dashedlink',
        buttonContainer: '<div class="search-resort" />',
        dropRight: true,
        maxHeight: 300,
        buttonText: function (options, select) {
            if ((options.length == 0) || (options.length == $('option', select).size())) {
                return this.nonSelectedText;
            }
            else {
                return options.length + ' курорт' + pluralize(options.length, '', 'а', 'ов');
            }
        }
    });


    $('.js-search-country').on('change', function(){
        if ($(this).val() != $('.js-hotel-name .select2-chosen span').data('country')) {
            $('.js-hotel-name').select2('val', '');
        }
    });

    $('.js-search-resort').on('change', function(){
        $('.js-hotel-name').select2('val', '');
    });

    // Название отеля
    function hotelResultFormat(hotel) {
        var markup = '';
        markup += '<p class="hotel-title">' + hotel['Title'] + ' <span class="hotel-stars">' + hotel['Stars'] + '<span class="icon-star"></span></span></p>';
        markup += '<p class="hotel-resort">' + hotel['Country'] + ', ' + hotel['City'] + '</p>';
        return markup;
    }
    function hotelSelectionFormat(hotel) {
        return '<span data-country="' + hotel['CountryID'] + '" data-resort="' + hotel['CityID'] + '">' + hotel['Title'];
    }

    var hotelData = [
        {"id":"82442","HotelID":"82442","Title":"Nehal by Bin Majid Hotels & Resorts","Country":"\u041e\u0410\u042d","CountryID":"90","City":"\u0410\u0431\u0443 \u0414\u0430\u0431\u0438","CityID":"8","Stars":"3","Rating":"5.8","Image":"http:\/\/hotels.sletat.ru\/i\/p\/82442_0_60_90_1.jpg","PageURL":"\/countries\/uae\/abu-dhabi\/hotel\/nehal-by-bin-majid-hotels--resorts\/"},
        {"id":"84513","HotelID":"84513","Title":"Emirates Park Resort","Country":"\u041e\u0410\u042d","CountryID":"90","City":"\u0410\u0431\u0443 \u0414\u0430\u0431\u0438","CityID":"8","Stars":"3","Rating":"0.0","Image":"http:\/\/storage.viasun.ru\/hotel\/edm1uae-qhimcixahi.jpg","PageURL":"\/countries\/uae\/abu-dhabi\/hotel\/emirates-park-resort\/"},
        {"id":"851","HotelID":"851","Title":"Al Diar Gulf Hotel & Resort","Country":"\u041e\u0410\u042d","CountryID":"90","City":"\u0410\u0431\u0443 \u0414\u0430\u0431\u0438","CityID":"8","Stars":"4","Rating":"8.9","Image":"http:\/\/hotels.sletat.ru\/i\/p\/851_0_60_90_1.jpg","PageURL":"\/countries\/uae\/abu-dhabi\/hotel\/al-diar-gulf\/"},
        {"id":"7691","HotelID":"7691","Title":"Cassells Ghantoot Hotel & Resort","Country":"\u041e\u0410\u042d","CountryID":"90","City":"\u0410\u0431\u0443 \u0414\u0430\u0431\u0438","CityID":"8","Stars":"4","Rating":"6.1","Image":"http:\/\/hotels.sletat.ru\/i\/p\/7691_0_60_90_1.jpg","PageURL":"\/countries\/uae\/abu-dhabi\/hotel\/cassells-ghantoot-hotel--resort\/"},
        {"id":"15849","HotelID":"15849","Title":"Golden Tulip Al Jazira Hotel & Resort","Country":"\u041e\u0410\u042d","CountryID":"90","City":"\u0410\u0431\u0443 \u0414\u0430\u0431\u0438","CityID":"8","Stars":"4","Rating":"7.3","Image":"http:\/\/hotels.sletat.ru\/i\/p\/15849_0_60_90_1.jpg","PageURL":"\/countries\/uae\/abu-dhabi\/hotel\/golden-tulip-al-jazira-hotel--resort\/"},
        {"id":"15930","HotelID":"15930","Title":"Golf hotel & Resorts","Country":"\u041e\u0410\u042d","CountryID":"90","City":"\u0410\u0431\u0443 \u0414\u0430\u0431\u0438","CityID":"8","Stars":"4","Rating":"0.0","Image":"http:\/\/storage.viasun.ru\/hotel\/zlg9uae-3exyyolzxt.jpg","PageURL":"\/countries\/uae\/abu-dhabi\/hotel\/golf-hotel--resorts\/"},
        {"id":"20380","HotelID":"20380","Title":"InterContinental Resort Al Ain","Country":"\u041e\u0410\u042d","CountryID":"90","City":"\u0410\u0431\u0443 \u0414\u0430\u0431\u0438","CityID":"8","Stars":"4","Rating":"8.0","Image":"http:\/\/storage.viasun.ru\/hotel\/ui0iuae-f1za76e529.jpg","PageURL":"\/countries\/uae\/abu-dhabi\/hotel\/intercontinental-resort-al-ain\/"},
        {"id":"82448","HotelID":"82448","Title":"One to One Hotel & Resort Ain Al Faida","Country":"\u041e\u0410\u042d","CountryID":"90","City":"\u0410\u0431\u0443 \u0414\u0430\u0431\u0438","CityID":"8","Stars":"4","Rating":"0.0","Image":"http:\/\/storage.viasun.ru\/hotel\/uae-ajman-2ko9kegm6l.jpg","PageURL":"\/countries\/uae\/abu-dhabi\/hotel\/one-to-one-hotel--resort-ain-al-faida\/"},
        {"id":"2193","HotelID":"2193","Title":"Qasr Al Sarab Desert Resort by Anantara","Country":"\u041e\u0410\u042d","CountryID":"90","City":"\u0410\u0431\u0443 \u0414\u0430\u0431\u0438","CityID":"8","Stars":"5","Rating":"9.1","Image":"http:\/\/hotels.sletat.ru\/i\/p\/2193_0_60_90_1.jpg","PageURL":"\/countries\/uae\/abu-dhabi\/hotel\/anantara-qasr-al-sarab-resort--spa\/"},
        {"id":"11456","HotelID":"11456","Title":"Desert Islands Resort & Spa by Anantara","Country":"\u041e\u0410\u042d","CountryID":"90","City":"\u0410\u0431\u0443 \u0414\u0430\u0431\u0438","CityID":"8","Stars":"5","Rating":"9.3","Image":"http:\/\/hotels.sletat.ru\/i\/p\/11456_0_60_90_1.jpg","PageURL":"\/countries\/uae\/abu-dhabi\/hotel\/desert-islands-resort--spa-by-anantara\/"},
        {"id":"38340","HotelID":"38340","Title":"Sheraton Abu Dhabi Hotel & Resort","Country":"\u041e\u0410\u042d","CountryID":"90","City":"\u0410\u0431\u0443 \u0414\u0430\u0431\u0438","CityID":"8","Stars":"5","Rating":"9.6","Image":"http:\/\/hotels.sletat.ru\/i\/p\/38340_0_60_90_1.jpg","PageURL":"\/countries\/uae\/abu-dhabi\/hotel\/sheraton-abu-dhabi-resort--towers\/"},
        {"id":"59592","HotelID":"59592","Title":"Danat Al Ain Resort","Country":"\u041e\u0410\u042d","CountryID":"90","City":"\u0410\u0431\u0443 \u0414\u0430\u0431\u0438","CityID":"8","Stars":"5","Rating":"7.8","Image":"http:\/\/hotels.sletat.ru\/i\/p\/59592_0_60_90_1.jpg","PageURL":"\/countries\/uae\/abu-dhabi\/hotel\/danat-al-ain-resort\/"},
        {"id":"61215","HotelID":"61215","Title":"Danat Jebel Dhanna Resort","Country":"\u041e\u0410\u042d","CountryID":"90","City":"\u0410\u0431\u0443 \u0414\u0430\u0431\u0438","CityID":"8","Stars":"5","Rating":"10.0","Image":"http:\/\/hotels.sletat.ru\/i\/p\/61215_0_60_90_1.jpg","PageURL":"\/countries\/uae\/abu-dhabi\/hotel\/danat-jebel-dhanna-resort\/"},
        {"id":"67313","HotelID":"67313","Title":"The St. Regis Saadiyat Island Resort","Country":"\u041e\u0410\u042d","CountryID":"90","City":"\u0410\u0431\u0443 \u0414\u0430\u0431\u0438","CityID":"8","Stars":"5","Rating":"9.3","Image":"http:\/\/hotels.sletat.ru\/i\/p\/67313_0_60_90_1.jpg","PageURL":"\/countries\/uae\/abu-dhabi\/hotel\/the-st-regis-saadiyat-island-resort\/"},
        {"id":"71455","HotelID":"71455","Title":"The Westin Abu Dhabi Golf Resort & Spa","Country":"\u041e\u0410\u042d","CountryID":"90","City":"\u0410\u0431\u0443 \u0414\u0430\u0431\u0438","CityID":"8","Stars":"5","Rating":"8.6","Image":"http:\/\/hotels.sletat.ru\/i\/p\/71455_0_60_90_1.jpg","PageURL":"\/countries\/uae\/abu-dhabi\/hotel\/westin-golf-resort--spa\/"},
        {"id":"75980","HotelID":"75980","Title":"Al Bada Hotel and Resort","Country":"\u041e\u0410\u042d","CountryID":"90","City":"\u0410\u0431\u0443 \u0414\u0430\u0431\u0438","CityID":"8","Stars":"5","Rating":"0.0","Image":"http:\/\/storage.viasun.ru\/hotel\/mcvhuae-vvzaxzl55z.jpg","PageURL":"\/countries\/uae\/abu-dhabi\/hotel\/al-bada-hotel-and-resort\/"},
        {"id":"80877","HotelID":"80877","Title":"Anantara Sir Bani Yas Island Al Yamm Villa Resort","Country":"\u041e\u0410\u042d","CountryID":"90","City":"\u0410\u0431\u0443 \u0414\u0430\u0431\u0438","CityID":"8","Stars":"5","Rating":"0.0","Image":"http:\/\/hotels.sletat.ru\/i\/p\/80877_0_60_90_1.jpg","PageURL":"\/countries\/uae\/abu-dhabi\/hotel\/anantara-al-yamm-villas\/"},
        {"id":"82534","HotelID":"82534","Title":"Anantara Sir Bani Yas Island Al Sahel Villa Resort","Country":"\u041e\u0410\u042d","CountryID":"90","City":"\u0410\u0431\u0443 \u0414\u0430\u0431\u0438","CityID":"8","Stars":"5","Rating":"0.0","Image":"http:\/\/hotels.sletat.ru\/i\/p\/82534_0_60_90_1.jpg","PageURL":"\/countries\/uae\/abu-dhabi\/hotel\/anantara-al-sahel-villas\/"},
        {"id":"39046","HotelID":"39046","Title":"Sofitel Agadir Royal Bay Resort","Country":"\u041c\u0430\u0440\u043e\u043a\u043a\u043e","CountryID":"75","City":"\u0410\u0433\u0430\u0434\u0438\u0440","CityID":"11","Stars":"5","Rating":"10.0","Image":"http:\/\/hotels.sletat.ru\/i\/p\/39046_0_60_90_1.jpg","PageURL":"\/countries\/morocco\/agadir\/hotel\/sofitel-agadir\/"},
        {"id":"87126","HotelID":"87126","Title":"Paradis Plage Surf Yoga & Spa Resort","Country":"\u041c\u0430\u0440\u043e\u043a\u043a\u043e","CountryID":"75","City":"\u0410\u0433\u0430\u0434\u0438\u0440","CityID":"11","Stars":"5","Rating":"0.0","Image":null,"PageURL":"\/countries\/morocco\/agadir\/hotel\/paradis-plage-surf-yoga--spa-resort\/"}
    ];

    $('.js-hotel-name').select2({
        adaptDropdownCssClass: function (c) {
            if (c.indexOf("js-hotel-name") === 0) return 'select2-hotel-name';
            return null;
        },
        allowClear: true,
        data: {results: hotelData, text: 'Title'},
        formatSelection: hotelSelectionFormat,
        formatResult: hotelResultFormat,
        placeholder: "название отеля"
    });

    $('.js-hotel-name').on('change', function(){
        var $hotel = $('.js-hotel-name .select2-chosen span');
        var $resortSelect =  $('.js-search-resort');
        $('.js-search-country').val($hotel.data('country')).trigger('change');
        $resortSelect.multiselect('deselectAll', false);
        if ($hotel.data('resort')) {
            $resortSelect.multiselect('select', $hotel.data('resort'));
        }
        $resortSelect.multiselect('updateButtonText');
    });

    // Выбор ночей
    $('.js-search-nights-toggle').on('show.bs.dropdown', function() {
        var $this = $(this),
            fromVal = parseInt($this.find('.search-nights-from').val()),
            toVal = parseInt($this.find('.search-nights-to').val());
        $this.find('.js-search-nights .item').removeClass('active current').each(function () {
            var val = parseInt($(this).data('value'));
            if (( (val >= fromVal) && (val <= toVal) ) || ( (val <= fromVal) && (val >= toVal) )) {
                $(this).addClass('current');
            }
        });
    });

    $('.js-search-nights .item').click(function(e) {
        var $this = $(this),
            $select = $this.parents('.js-search-nights'),
            $wrap = $this.parents('.js-search-nights-toggle');
        if (!$this.hasClass('active')) {
            var nightsFirst = parseInt($(this).data('value'));
            $wrap.find('.item').removeClass('current');
            $wrap.find('.item.hover').addClass('active');

            var text = nightsFirst,
                $inputFrom = $wrap.find('.search-nights-from'),
                $inputTo = $wrap.find('.search-nights-to');
            if ($select.find('.item.hover').length == 1) {
                $inputFrom.val(nightsFirst);
                $inputTo.val(nightsFirst);
                e.stopPropagation();
            } else {
                var nightsSecond = parseInt( $inputFrom.val());
                if (nightsFirst > nightsSecond) {
                    text = nightsSecond + ' – ' + nightsFirst;
                    $inputTo.val(nightsFirst);
                } else {
                    text = nightsFirst + ' – ' + nightsSecond;
                    $inputTo.val(nightsSecond);
                    $inputFrom.val(nightsFirst);
                }
            }
            $wrap.find('.js-nights-value').text(text);
        }
    }).hover(function () {
        var $this = $(this),
            $select = $this.parents('.js-search-nights');
        if ($select.find('.item.active').length == 1) {
            var fromVal = parseInt($select.find('.item.active').data('value'));
            var toVal = parseInt($this.data('value'));
            $select.find('.item').removeClass('hover').each(function () {
                var val = parseInt($(this).data('value'));
                if (( (val >= fromVal) && (val <= toVal) ) || ( (val <= fromVal) && (val >= toVal) )) {
                    $(this).addClass('hover');
                }
            });
        } else {
            $select.find('.item').removeClass('hover');
            $this.addClass('hover');
        }
    }, function (){
        $(this).parents('.js-search-nights').find('.item.hover').removeClass('hover');
    });

    $('.js-search-people .dropdown-toggle').click(function(e){
        e.stopPropagation();
        var $this = $(this);
        var $formGroup = $this.parent('.form-group');
        if ($formGroup.hasClass('open')) {
            $formGroup.removeClass('open');
        } else {
            $this.parents('.js-search-people').find('.form-group').removeClass('open');
            $formGroup.addClass('open');
        };
    });

    var updatePeople = function(parent){
        console.log(parent);
        var k = parent.find('.js-search-adults-value').text(),
            text = '1 взрослый';
        if (k != 1) {
            text = k + ' взрослых';
        }
        parent.find('.js-search-adults-span').text(text);

        var $this = parent.find('.js-search-children-value');
        k = $this.text();
        text = 'Без детей';
        if (k != 0) {
            if (k == 1) {
                text = '1 ребёнок';
            } else {
                text = k + ' ребёнка';
            }
            $this.parents('.js-search-people').find('.children-age').each(function(){
                if (k > 0) {
                    $(this).removeClass('off');
                } else {
                    $(this).addClass('off');
                }
                k -= 1;
            });
            $this.parents('.js-search-people').find('.children-ages').removeClass('off');
        } else {
            $this.parents('.js-search-people').find('.children-ages').addClass('off');
        }
        parent.find('.js-search-children-span').text(text);
    };

    $('.dropdown-simpleselect .item').click(function(e){
        e.stopPropagation();
        var $this = $(this);
        var $formGroup = $this.parent('.dropdown-menu').parent('.form-group');
        $formGroup.find('.dropdown-toggle').text($this.text());
        $formGroup.toggleClass('open');
        $formGroup.find('.item.active').removeClass('active');
        $this.addClass('active');
        updatePeople($formGroup.parents('.people'));
    });

    $('.js-search-people #search-children').change(function(e){

    });
});
