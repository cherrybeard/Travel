$(function () {
    var updateAnimation = function($el, value, method){
        $el.fadeOut(100, function(){
            if (method == 'html'){
                $el.html(value);
            } else {
                $el.text(value);
            }
            $el.fadeIn();
        });
    }

    var getReviewChild = function (affixClass) {
        return $('.' + reviewClass + ' .' + affixClass)
    }

    var updateReviews = function(){
        var $currentReview = $('.' + reviewGroupClassPrefix + currentReviewGroupNumber + ' .' + reviewClassPrefix + currentReviewNumber);
        currentReviewGroupTotal = $('.' + reviewGroupClassPrefix + currentReviewGroupNumber + '>[class^="'+ reviewClassPrefix + '"]').length;
        updateAnimation(getReviewChild(reviewNameClass), $currentReview.find('.' + reviewNameClass).text(), 'text');
        updateAnimation(getReviewChild(reviewDateClass), $currentReview.find('.' + reviewDateClass).text(), 'text');
        updateAnimation(getReviewChild(reviewTextClass), $currentReview.find('.' + reviewTextClass).html(), 'html');
        getReviewChild(reviewNumberClass).text(currentReviewNumber);
        getReviewChild(reviewTotalClass).text(currentReviewGroupTotal);
    };

    var checkReviewLimits = function(){
        if (currentReviewNumber <= 0) {
            currentReviewNumber = currentReviewGroupTotal;
        } else if (currentReviewNumber > currentReviewGroupTotal) {
            currentReviewNumber = 1;
        }
    };

    /* Reviews initialization */
    var reviewGroupClassPrefix = 'js-review-group-';
    var reviewClassPrefix = 'js-review-';

    var reviewClass = 'js-review';
    var reviewNameClass = 'js-review-name';
    var reviewDateClass = 'js-review-date';
    var reviewTextClass = 'js-review-text';
    var reviewNumberClass = 'js-review-number';
    var reviewTotalClass = 'js-review-total';

    var currentReviewGroupNumber = 1;
    var currentReviewGroupTotal = 1;
    var currentReviewNumber = 1;

    for (var i=1; i<=3; i++)
    {
        var groupLength = $('.' + reviewGroupClassPrefix + i + '>[class^="'+ reviewClassPrefix + '"]').length;
        $('.js-review-group-link-' + i + ' .js-review-group-total').text(groupLength);
        if (groupLength == 0) {
            $('.js-review-group-link-' + i).addClass('disabled');
        } else if (!$('.js-review-group-link.current').length) {
            $('.js-review-group-link-' + i).addClass('current');
            currentReviewGroupNumber = i;
        }
    };

    if ($('.js-review-group-link.current').length) {
        updateReviews();
    } else {
        $('.' + reviewClass).addClass('reviews-empty');
        $('.' + reviewClass + ' .' + reviewTextClass).text('На этот отель нет отзывов');
        $('.' + reviewClass + ' .' + reviewTextClass).attr('data-toggle', '');
    }

    $('.js-review-next').click(function(e){
        e.preventDefault();
        currentReviewNumber += 1;
        checkReviewLimits();
        updateReviews();
        var $modal = $(this).parents('.modal');
        if ($modal.length){
            $modal.animate({
                scrollTop: $modal.find('.js-review').position().top
            });
        }
    });

    $('.js-review-prev').click(function(e){
        e.preventDefault();
        currentReviewNumber -= 1;
        checkReviewLimits();
        updateReviews();
        var $modal = $(this).parents('.modal');
        if ($modal.length){
            $modal.animate({
                scrollTop: $modal.find('.js-review').position().top
            });
        }
    });

    $('.js-review-group-link').click(function(e){
        e.preventDefault();
        if (!$(this).hasClass('current') && !$(this).hasClass('disabled')) {
            $('.js-review-group-link').removeClass('current');
            currentReviewGroupNumber = $(this).data('group');
            currentReviewNumber = 1;
            updateReviews();
            $('.js-review-group-link-'+ currentReviewGroupNumber).addClass('current');
        }
    });

    $('.js-map').each(function(){
        var lat = $(this).data('lat');
        var lng = $(this).data('lng');
        var pos = new google.maps.LatLng(lat, lng);
        var controls = !($(this).data('size') == 'small');
        var map = new google.maps.Map($(this)[0], {
            scrollwheel: false,
            zoom: 12,
            center: pos,
            zoomControl: controls,
            streetViewControl: controls,
            overviewMapControl: controls,
            mapTypeControl: controls
        });
        new google.maps.Marker({position: pos, map: map});
    });

    $('.js-new-search').click(function(e) {
        e.preventDefault();
        toggleTargets($('.js-search-form'), $('.js-search-placeholder'));
    });

    $('.js-close-search').click(function(e) {
        e.preventDefault();
        toggleTargets($('.js-search-placeholder'), $('.js-search-form-collapsing'));
    });

    //TODO: delete this, just for testing
    $('.js-update-price').click(function(){
        var $this = $(this);
        var $tour = $this.closest('.line');
        $tour.removeClass('error')
            .addClass('wait');
        $tour.find('.price .small').addClass('off');
        $this.addClass('btn-progress btn-grayborder')
            .removeClass('btn-yellow')
            .text('Уточняем цену')
            .prop('disabled', true);
        setTimeout(function(){
            $tour.removeClass('wait');
            $this.removeClass('btn-progress btn-grayborder')
                .addClass('btn-yellow')
                .text('Купить')
                .prop('disabled', false);
            $tour.find('.price .small').removeClass('off')
                .html('цена снижена на 400 <span class="icon-ruble"></span>');
        }, 3000);
    });

});