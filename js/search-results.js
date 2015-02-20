$(function () {
    var $searchBar = $('.js-search-bar');
    var $searchFilters = $('.search-filters');
    var $filtersWrap = $searchFilters.parents('.col-md-3');
    var $searchTools = $('.search-tools');
    var stickHeaderHeight = 0;
    var searchbarHeight = 0;
    var offsetBottom = $('footer').outerHeight() + 30;

    var stickHeaderHeightF = function() {
        return $('.navbar').height() + searchbarHeight - 45;
    };

    var stickHeaderHeightCopy = function(){
        return stickHeaderHeight;
    }

    var updateHeaderHeight = function(){
        searchbarHeight = $searchBar.outerHeight();
        stickHeaderHeight = stickHeaderHeightF();
    };

    if ($searchBar.length) {
        updateHeaderHeight();
    }

    var updateHeight = function() {
        $filtersWrap.css({
            'min-height': $searchFilters.height()
        });
    }

    var updateWidths = function(){
        $searchFilters.width($filtersWrap.width());
        $searchTools.width($searchTools.parents('.col-md-9').width());
    }

    var updateHorizontalPos = function(){
        $searchFilters.css({
            left: $filtersWrap.position().left - $(window).scrollLeft() + 15
        });
        $searchBar.css({
            left: - $(window).scrollLeft()
        });
        $searchTools.css({
            left: $searchTools.closest('.col-md-9').position().left - $(window).scrollLeft() + 15
        });
    }

    // works for textarea
    $.fn.selectRange = function(start, end) {
        if(!end) end = start;
        return this.each(function() {
            if (this.setSelectionRange) {
                this.focus();
                this.setSelectionRange(start, end);
            } else if (this.createTextRange) {
                var range = this.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        });
    };

    /*
    // works for div with contentEditable
    $.fn.selectRange = function(pos) {
        return this.each(function() {
            var range = document.createRange();
            var sel = window.getSelection();
            range.setStart(this.childNodes[0], pos);
            sel.removeAllRanges();
            sel.addRange(range);
        });
    };
    */

    updateHeight();
    updateWidths();

    $('.js-new-search').click(function(e) {
        e.preventDefault();
        toggleTargets($('.js-search-form'), $('.js-search-placeholder'));
        $('.js-new-search.link-dashed').addClass('disabled');
        if ($('.js-search-bar').hasClass('affix')) {
            $("html, body").animate({ scrollTop: $('.navbar').height() }, "fast", function(){
                updateHeaderHeight();
            });
        } else {
            updateHeaderHeight();
        }
    });

    $('.js-close-search').click(function(e) {
        e.preventDefault();
        toggleTargets($('.js-search-placeholder'), $('.js-search-form'));
        updateHeaderHeight();
    });


    $('.slider-money').slider({
        step: 1000,
        tooltip: 'hide',
        range: true
    });

    $('.slider-rating').slider({
        step: '0.1',
        tooltip: 'hide',
        value: 1,
        min: 0,
        max: 10,
        selection: 'after',
        id: 'slider-rating'
    });

    $('.js-filters-reset').click(function(){
        $(this).parents('form').find('input[type="checkbox"]:checked').prop('checked', false);
    });

    // Fixed top
    $searchFilters.affix({
        offset: {
            top: stickHeaderHeightCopy,
            bottom: offsetBottom
        }
    });

    $searchTools.affix({
        offset: {
            top: stickHeaderHeightCopy
        }
    });

    $searchBar.affix({
        offset: {
            top: stickHeaderHeightCopy
        }
    });

    $searchBar.on('affix.bs.affix', function(){
        $('.navbar').css({
            marginBottom: searchbarHeight
        });
        $('.search-results-wrap').css({
            marginTop: $searchTools.outerHeight()
        });
        $('.js-search-country').select2('close');
        $('.js-hotel-name').select2('close');
        $('.search-resort').removeClass('open');
        $('[data-date]').data("DateTimePicker").hide();
        $('.js-search-nights-toggle').removeClass('open');
        $('.js-search-child-toggle').removeClass('open');
        $('.select-checkbox').removeClass('open');
        $('.js-search-people-toggle').removeClass('open');
    });

    $searchBar.on('affix-top.bs.affix', function() {
        $('.navbar').css({
            marginBottom: 0
        });
        $('.search-results-wrap').css({
            marginTop: 0
        });
        $('#page_search-results').css({
            paddingTop: 0
        });
    });

    $('.search-filters .collapse').on('shown.bs.collapse hidden.bs.collapse', function(){
        updateHeight();
        $('body').trigger("scroll");
    });

    var filtersPopoverShowed = 0;
    var filtersPopoverTimeout = 3000;
    var $filtersPopover = $searchFilters.popover({
        container: '.search-filters',
        content: '<span class="js-apply-filters-number">124</span> отеля <a href="" class="btn btn-yellow btn-compact js-apply-filters">Показать</a>',
        //content: 'Ничего не найдено',
        html: true,
        placement: 'left',
        template: applyPopoverStyle('popover-small popover-apply-filters'),
        trigger: 'manual'
    }).on("shown.bs.popover", function(){
        filtersPopoverShowed = new Date().getTime();
        setTimeout(function(){
            if (filtersPopoverShowed < (new Date().getTime() - filtersPopoverTimeout + 1)) {
                $filtersPopover.popover("hide");
            }
        }, filtersPopoverTimeout);
    });

    $searchFilters.find('input[type="checkbox"]').change(function() {
        $filtersPopover.popover('show');
        $filtersPopover.find('.js-apply-filters-number').text('22');
    });

    // search tools
    $('.js-show-all-tours').click( function(){
        $(this).parent('.show-all-tours-wrap').find('.search-done').toggleClass('expanded');
    });

    var expandGetaquote = function($getaquoteask){
        var $textareawrap = $getaquoteask.find('.textarea'),
            $textarea = $textareawrap.find('textarea');
        $getaquoteask.addClass('expanded');
        $textareawrap.animate({
            height: '8em'
        }, 500, function(){
            $textarea.selectRange($textarea.text().length);
        });
        $getaquoteask.find('.close').removeClass('hidden');
    };

    $('.js-getaquote .getaquote-ask .textarea').click(function(){
        var $this = $(this),
            $getaquoteask = $this.parents('.getaquote-ask');
        if (!$getaquoteask.hasClass('expanded')){
            expandGetaquote($getaquoteask);
        }
    });

    $('.js-getaquote .getaquote-ask button.close').click(function(e) {
        var $this = $(this),
            $getaquoteask = $this.parents('.getaquote-ask'),
            $textareawrap = $getaquoteask.find('.textarea');

        $getaquoteask.removeClass('expanded');
        $textareawrap.animate({
            height: '2.5em'
        }, 300);
        $this.addClass('hidden');
    });

    $('.js-getaquote .getaquote-ask button[type=submit]').click(function(e){
        e.preventDefault();
        var $getaquoteask = $(this).parents('.getaquote-ask');
        if (!$getaquoteask.hasClass('expanded')) {
            expandGetaquote($getaquoteask);
        } else {
            var hasErrors = false;
            // insert validation here
            $getaquoteask.find('input[type="text"]').each(function(){
                var $this = $(this);
                if (!$this.val()) {
                    $this.parent('.form-group').addClass('has-error');
                    hasErrors = true;
                }
            });

            if (hasErrors) return;
            var $getaquote = $(this).parents('.getaquote');
            $getaquoteask.addClass('hidden');
            $getaquote.find('.getaquote-next').removeClass('hidden');
        }
    });

    $('.js-getaquote .getaquote-next input[type="radio"]').change(function(){
        $(this).parents('.getaquote-next').find('button').attr('disabled', false);
    });

    $('.js-getaquote .getaquote-next button[type=submit]').click(function(e){
        e.preventDefault();
        var $getaquote = $(this).parents('.getaquote');
        $getaquote.find('.getaquote-next').addClass('hidden');
        $getaquote.find('.getaquote-thanks').removeClass('hidden');

    });

    $('.js-hotel-video').click(function(){
        var $this = $(this),
            $container = $($this.data('target')).find('.video'),
            video = $this.data('source');
        video = video.replace(/(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '<iframe src="http://www.youtube.com/embed/$1?wmode=opaque&amp;rel=0&amp;autohide=1&amp;showinfo=0&amp;wmode=transparent" frameborder="0" allowfullscreen></iframe>').replace(/(?:http:\/\/)?(?:www\.)?(?:vimeo\.com)\/(.+)/g, '<iframe src="//player.vimeo.com/video/$1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
        $container.html(video);
    });

    $('#modal-hotel-video').on('hidden.bs.modal', function(){
        $(this).find('.video').empty();
    });

    $(window).scroll(updateHorizontalPos);
    $(window).resize(function(){
        updateWidths();
        updateHorizontalPos();
    });

});