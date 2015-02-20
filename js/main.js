function pluralize(count, s1, s2, s3) {
    var value = parseInt(count);
    if ([11, 12, 13, 14].indexOf(value % 100) != -1) {
        return s3;
    } else if (value % 10 == 1) {
        return s1;
    }
    if ([2, 3, 4].indexOf(value % 10) != -1) {
        return s2;
    }
    return s3;
}

var scrollTo = function (y, time) {
    time = time || 500;
    $('html,body').animate({
        scrollTop: y
    }, time);
};

var toggleTargets = function ($show, $hide) {
    $hide.addClass('off');
    $show.removeClass('off');
};

var applyPopoverStyle = function(style){
    var popoverTemplate = '<div class="popover ';
    popoverTemplate += style;
    popoverTemplate += '" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>';
    return popoverTemplate;
};

function getScrollBarWidth() {
    var scrollDiv = document.createElement('div'),
        $body = $('body');
    scrollDiv.className = 'modal-scrollbar-measure';
    $body.append(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    $body[0].removeChild(scrollDiv);
    return scrollbarWidth
}

$(function () {
    "use strict";

    // data correction
    $(".form-group > [data-correct]").bind('keyup', function () {
        var minLength = $(this).data('minlength') || 0;

        if (!minLength) {
            return;
        }

        if (minLength > $(this).val().length) {
            $(this).parent().addClass("has-error");
        } else {
            $(this).parent().removeClass("has-error");
        }
    });

    $(".form-group > [data-correct=money]").inputmask("mask", {alias: 'integer', allowMinus: false, groupSeparator: ' ', autoGroup: true});
    $(".form-group > [data-correct=name]").inputmask("Regex", {regex: "^[йцукенгшщзхъфывапролджэячсмитьбюЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ]+"});
    $(".form-group > [data-correct=name_eng]").inputmask("Regex", {regex: "^[A-Za-z]+"});
    $(".form-group > [data-correct=number]").inputmask("Regex", {regex: '[0-9]+'});

    $(".form-group > [data-correct=date]").inputmask("mask", {
        alias: 'dd.mm.yyyy', placeholder: "дд.мм.гггг",
        onKeyUp: function (result) {
            if (!$(this).inputmask("isComplete")) {
                $(this).parent().addClass("has-error");
            } else {
                $(this).parent().removeClass("has-error");
            }
        }
    });

    $(".form-group > [data-correct-same]").bind('keyup', function () {
        var same = $(this).data('correct-same') || null;

        if (!same) {
            return;
        }

        if ($(same).val() != $(this).val()) {
            $(this).parent().addClass("has-error");
        } else {
            $(this).parent().removeClass("has-error");
        }
    });

    $(".form-group > [data-correct=phone]").bind('keyup', function () {
        var phone = $(this).val().replace(/[ \-\.\(\)]/g, '');
        if (phone.length < 6
            || phone.match(/([0-9])\1{4,}/g)
            || !phone.match(/^(?:8(?:(?:21|22|23|24|51|52|53|54|55)|(?:15\d\d))?|\+?7)?(?:(?:3[04589]|4[012789]|7\d|8[^89\D]|9\d)\d)\d{7}$|^[12345679]\d{5,6}$/)) {
            $(this).parent().addClass("has-error");
            return;
        }
        $(this).parent().removeClass("has-error");
    }).inputmask("mask", {"mask": "+7 (\\999) 999-9999"});

    $(".form-group > [data-correct=email]").bind('keyup', function () {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test($(this).val())) {
            $(this).parent().addClass("has-error");
            return;
        }
        $(this).parent().removeClass("has-error");
    }).inputmask("mask", {alias: 'email'});

    // country select
    function countryFormat(state) {
        var originalOption = state.element;
        if ($(originalOption).val()) {
            return '<span class="flag-' + $(originalOption).val() + '"></span> ' + state.text;
        } else {
            return state.text;
        }
    }

    $("select.country-format").select2({
        formatSelection: countryFormat,
        formatResult: countryFormat,
        placeholder: "Выберите страну",
        adaptDropdownCssClass: function (c) {
            if (c.indexOf("js-search-country") === 0) return 'select2-search-country';
            return null;
        }
    });

    // checkbox group
    $('.checkbox-group input[type="checkbox"]').change(function () {
        var $this = $(this);
        var $parent = $this.closest('.checkbox-group');
        if ($this.hasClass('all')) {
            $this.prop('checked', true);
            $parent.find('.regular').prop('checked', false);
        } else {
            if ($this.prop('checked')) {
                $parent.find('.all').prop('checked', false);
            } else if ($parent.find('.regular:checked').length == 0) {
                $parent.find('.all').prop('checked', true);
            }
        }
    });


    // link superhover
    /*
    $('a').hover(
        function () {
            if (($(this).attr('href') != '') && ($(this).attr('href') != '#')) {
                $('a[href="' + $(this).attr('href') + '"]').addClass('hover')
            }
        },
        function () {
            $('a').removeClass('hover')
        }
    );*/

    // smooth scrolling
    $('a.smooth-scrolling').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            var slice = this.hash.slice(1);
            var pos = 0;
            if (slice) {
                target = target.length ? target : $('[name=' + slice + ']');
            }
            if (target.length) {
                pos = target.offset().top
            }
            scrollTo(pos);
            return false;
        }
    });

    // goback
    $('.goback .js-collapse').click(function(e){
        e.preventDefault();
        $(this).parent('.goback').toggleClass('collapsed');
    });
});