$(function(){
    "use strict";

    $('.js-input-sex').click(function (e) {
        e.preventDefault();
        $(this).find('input[type="radio"]').each(function () {
            $(this).prop('checked', !$(this).prop('checked'));
        });
    });

    $('.js-add-comment').click(function (e) {
        e.preventDefault();
        var root = $(this).parents('.comment');
        root.find('.placeholder').addClass('hidden');
        root.find('input').removeClass('hidden');
    });

    $('.js-offer-accepted').change(function () {
        if (this.checked) {
            $('.js-continue-payment').removeAttr('disabled');
        } else {
            $('.js-continue-payment').attr('disabled', 'disabled');
        }
    });

    $('.js-toggle-form').click(function (e) {
        e.preventDefault();
        var target = $(this).data('target');
        $(target).toggleClass('hidden');
        $(this).toggleClass('active');
    });
});