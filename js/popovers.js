
$(function () {

    $('.hotel-badge').popover({
        content: 'Этот отель рекомендуют эксперты viasun.travel.',
        delay: {show: 300, hide: 100},
        placement: 'left',
        template: '<div class="popover popover-small popover-recommended" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
        title: 'Рекомендованный отель',
        trigger: 'hover'
    });

    $('.hotel-rating').popover({
        content: 'Основан на оценках туристов.',
        delay: {show: 300, hide: 100},
        placement: 'left',
        template: '<div class="popover popover-small popover-rating" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
        title: 'Рейтинг отеля',
        trigger: 'hover'
    });

    $('.js-order-hurry').popover({
        container: 'body',
        html: true,
        placement: 'bottom',
        template: '<div class="popover popover-light popover-hurry" role="tooltip"><div class="arrow"></div><div class="close"><span class="">&times;</span></div><div class="popover-content"></div></div>',
        trigger: 'focus'
    });

    $('.js-what-next').popover({
        container: 'body',
        html: true,
        placement: 'top',
        template: '<div class="popover popover-light popover-next" role="tooltip"><div class="arrow"></div><div class="close"><span class="">&times;</span></div><div class="popover-content"></div></div>',
        trigger: 'focus'
    });
});
