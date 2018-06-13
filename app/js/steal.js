var xhr = false, interval = false, popup_interval = false, popup_sticky_interval = false, popup_keypressed = false, hint_interval = false, hint_open_interval = false;

$(document).ready(function() {
    $('.box').mouseenter(function () {
        $(this).toggleClass('box_open');
        $('.boxes').find('.box_open + .box + .box + .box .box-shadow').css("background-color", "rgba(0,0,0,0.5)").css("z-index", "3").toggleClass('shadow_open');
        $(this).find('.box-hidden').stop(true,true).slideDown();

    }).mouseleave(function () {
        $(this).find('.box-hidden').stop(true,true).slideUp();
        $('.boxes').find('.box_open + .box + .box + .box .box-shadow').css("background-color", "rgba(0,0,0,0)").css("z-index", "-2").toggleClass('shadow_open');
        $(this).toggleClass('box_open');
    });

    //placeholder
    $('[placeholder]').focus(function() {
        var input = $(this);
        if (input.val() == input.attr('placeholder')) {
            input.val('');
            input.removeClass('placeholder');
        }
    }).blur(function() {
        var input = $(this);
        if (input.val() == '' || input.val() == input.attr('placeholder')) {
            input.addClass('placeholder');
            input.val(input.attr('placeholder'));
        }
    }).blur();
    $('[placeholder]').parents('form').submit(function() {
        $(this).find('[placeholder]').each(function() {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
            }
        });
    });

//    if ($('.tov.object').length > 0) catalogEqualHeights();

    tovarImgTipso();

    $('.state-in .foto.tipso').tipso({position: 'left', background: '#999', color: '#333', size: 'small',
        onBeforeShow: function ($element, element) {
            // Your code
            if ($element.attr('data-tipso')) {
                $element.tipso('update', 'content', '<div style="min-height: 100px"><img src="' + $element.attr('data-tipso') + '"></img></div>');
            }else{
                $element.tipso('update', 'content', '<img src="/images/no_foto.png" style="width:232px"></img>');
            }
        }
    });
    //$('.state-in .foto, .tovar-img').tipso('show');

	//$('.help').tipso({position: 'bottom', background: '#eef7dd', color: '#333', size: 'small'});
	$('.help').mouseenter(function() {
		clearTimeout(hint_interval);
		hint_open_interval = setTimeout(openFilterHint, 500);

		$('.help').removeClass('over');
		var $this = $(this);
		$this.addClass('over');
	})
	.mouseout(function() {
		clearTimeout(hint_open_interval);
		hint_interval = setTimeout(closeFilterHint, 300);
		$('.help').removeClass('over');
	});

	function view_hint($this) {
            var he1 = $this.offset().top + 24;
            var he2 = $this.offset().left - $('#filterhint').width() / 2 - 8;
            $('#filterhint').html('<i/>' + $this.find('div').html());
            $('#filterhint').css({'top': he1, 'left':he2}).fadeIn(200, function() {
                $('.help').unbind('mouseleave');
                if ($('.help.open').length < 0) {closeFilterHint(); return;}
                $($this).mouseleave(function() {
                    hint_interval = setTimeout(closeFilterHint, 300);
                });
            });
	}

	$('#filterhint').mouseleave(function() {
            hint_interval = setTimeout(closeFilterHint, 300);
	});

	$('#filterhint').mousemove(function() {
            clearTimeout(hint_interval);
	});

	function openFilterHint() {
            clearTimeout(hint_open_interval);
            clearTimeout(hint_interval);

            var $this = $('.help.over');
            if ($this) {
                if ($this.hasClass('loaded')) {
                    view_hint($this);
                }else{
                    $this.addClass('loaded');
                    var url = "/ajax/tooltip.php?typeid=" + $this.data('type') + '&name=' + $this.data('name');
                    jQuery.ajax({
                        url : url,
                        cache : false,
                        dataType : 'html',
                        success : function(data) {
                            $this.find('div').html(data);
                            if ($('.help.open').length < 0) {closeFilterHint(); return;}
                            view_hint($this);
                        }
                    });
                }
            }
	}

	function closeFilterHint() {
            clearTimeout(hint_interval);
            //$('.help').removeClass('over');
            $('#filterhint').removeClass('open').hide();
	}

	// -----------------   popup login/registration  ----------------------------

	$('#poplogin').appendTo($('#content > .cont-in'));

	$('.user-links.popup li.user').mouseover(function(e) {
            //console.log('popup-mouseover');
            if (!$(e.target).hasClass('open')) {
                $('#poplogin').addClass('open').slideDown();
                popup_keypressed = false;
            }
            clearTimeout(popup_interval);
	});

	$('.user-links.popup li:not(.user)').mouseover(function(e) {
		closeLkPopUp();
	});

	$('#poplogin').mouseleave(function() {
		popup_interval = setTimeout(closeLkPopUp, 2000);
	});

	$('#poplogin').mousemove(function() {
		clearTimeout(popup_interval);
	});

	function closeLkPopUp() {
		clearTimeout(popup_interval);
		//console.log('closePopUp');
		//mouseX = 0;
		//mouseY = 0;
		if (!popup_keypressed) {
			$('#poplogin').removeClass('open').hide();
		}
	}

	$('body').click(function(e) {
		//console.log(e.target);
		if (($(e.target).parents('#poplogin').length < 1 && $(e.target).attr('id') != 'poplogin') && $('#poplogin').hasClass('open')) {
			$('#poplogin').removeClass('open').hide();
			popup_keypressed = false;
			clearTimeout(popup_interval);
		}
		$('.compareboxfixed').hide();
		if (($(e.target).parents('#filterhint').length < 1 && $(e.target).attr('id') != 'filterhint')) { $('#filterhint').hide();}
	});

	if ($('input[data-limit]').length > 0) {
		checkFloatPar();
		$('input[data-limit]').inputmask("decimal", { radixPoint: ".", allowMinus: false, allowPlus: false, min:0, rightAlign: true, autoGroup: true, groupSeparator: " ", groupSize: 3 });
	}

	if ($('#poplogin input.tel').length > 0) {
            $('#poplogin input.code').inputmask("999", {
                onKeyValidation: function () {
                    popup_keypressed = true;
                },
                oncomplete : function () {
                    var input = $('#poplogin input.tel');
                    input.focus().setCursorPosition(input.val().length);
                }
            });
            $('#poplogin input.tel').inputmask("999-99-99", {
                onKeyValidation: function () {
                    popup_keypressed = true;
                },
                oncomplete : function () {
                    if($('#poplogin input.code').val().substr(0,1) === '9'){
                        var url = "/udata/users/check_phone?phone=" + '(' + $('#poplogin input.code').val() + ')' + $(this).val();
                        jQuery.ajax({
                            url : url,
                            cache : false,
                            dataType : 'xml',
                            success : function(data) {
                                var id = parseInt($(data).find('udata').text());
                                $('.m-phone').show();
                                $('.auth_button').hide();
                                if (id > 0) {
                                    $('#poplogin .title').text('Вход в личный кабинет');
                                    popup_error_clear($('#poplogin'));
                                    $('#poplogin  .phonebox').removeClass('init');
                                    $('.auth_reg').slideUp();
                                    $('.auth_password').slideDown();
                                }else{
                                    $('#poplogin .title').text('Регистрация');
                                    popup_error_clear($('#poplogin'));
                                    $('#poplogin  .phonebox').removeClass('init');
                                    $('.auth_password').slideUp();
                                    $('.auth_reg').slideDown();
                                    var feel = false;
                                    $('#poplogin .auth_reg input[type="text"]').each(function() {if ($(this).val().length > 0){feel = true;}});
                                    if (feel) 	{
                                        var check = popup_validation_test('#popup_registrate');
                                    }
                                }
                            }
                        });
                    }else{
                        $('#poplogin input.code').focus();
                    }
                }
            });
	}

	function popup_error_clear(obj) {
		obj.find('.error_msg').text('');
		obj.find('.error-field').removeClass('error-field');
	}

	$('#poplogin .forget a').click(function() {
		var url = "/udata/users/forget_mobile_do?ajax=1&forget_login=" + '(' + $('#poplogin input.code').val() + ')' + $('#poplogin input.tel').val();
		$('#poplogin .forget').addClass('loading');
		jQuery.ajax({
			url : url,
			cache : false,
			dataType : 'xml',
			success : function(data) {
				$('#poplogin .forget').removeClass('loading');
				var id = parseInt($(data).find('udata').text());
				if (id > 0) {
				}else{
				}
			}
		});
	});

	$('#poplogin .enter .btn').click(function() {
		$('#poplogin input[name="password"]').parents('.box-field').removeClass('error-field');
		var url = "/udata/users/ajax_login_phone?phone=" + '(' + $('#poplogin input.code').val() + ')' + $('#poplogin input.tel').val() + '&password=' + $('#poplogin input[name="password"]').val() + '&from_page=/emarket/ordersList/';
		jQuery.ajax({
			url : url,
			cache : false,
			dataType : 'xml',
			success : function(data) {
				var id = parseInt($(data).find('udata').text());
				if (id > 0) {
					window.location.href='/emarket/ordersList/';
				}else{
					$('#poplogin input[name="password"]').parents('.box-field').addClass('error-field');
				}
			}
		});
		return false;
	});


	//$('#poplogin .auth_reg input[type="text"], #poplogin .auth_reg input[type="checkbox"]').keyup(function() {
    //$('#poplogin .auth_reg input[type="text"], #poplogin .auth_reg input[type="checkbox"]').on('paste, keyup,propertychange', function() {
	$('#poplogin input[type="password"], #poplogin .auth_reg input[type="text"], #poplogin .auth_reg input[type="checkbox"]').bind("propertychange keyup input paste change", function(event){
		popup_keypressed = true;
		clearTimeout(popup_interval);
		var div = $(this).parents('.box-field');

		/*if($(this).val().length < 2 || $(this).val() == $(this).attr('placeholder')){
			div.addClass('error-field').removeClass('valid-field');
		}else{
			div.removeClass('error-field').addClass('valid-field');
			div.find('.icon-valid').show();
		}*/

		var check = popup_validation_test('#popup_registrate');
	});

	function popup_validation_test(form_id) {
		var btn = $('#poplogin .main-button-order.main-button-order_reg .btn');
		var check = validation(form_id);

		check = (check && $('#poplogin .auth_reg input[type="checkbox"][name="agreed-with-terms"]').is(':checked')) ? true : false;

		if (check) {
			btn.removeClass('gray').removeAttr('disabled');
		}else{
			btn.addClass('gray').attr('disabled', true);
		}
		return check;
	}


	// -----------------------------  end popup ------------------------------

	$(".text-opener").click(function (){
            $(this).prev('.text-limit').toggleClass('open');
            $(this).text(function(i, text){
                return text === "развернуть текст" ? "свернуть текст" : "развернуть текст";
            });
            return false;
	});

        // скрываем кнопку сворачивания текста, если текста мало
	$(".text-opener").each(function (){
            var parent = $(this).prev('.text-limit');
            $(parent).css('max-height', 'none');
            if(parent.outerHeight() <= 379){
                $(this).hide();
            }
            $(parent).removeAttr('style');
	});


	$(".popular-cats .more-local").click(function (){
		$(this).prev().find('.hid').toggleClass('open');
		$(this).text(function(i, text){
			return text === "Развернуть все" ? "Свернуть все" : "Развернуть все";
		});
		return false;
	});

	//
    //$('select, .file-inp, .check input:not(:radio)').styler();
	$('.table-bask .box-checkbox input, #con_tab_profile .order-step input, #registrate .order-step input, #terms-agreem').styler();
	$('select').styler();
	/*$('.check input:radio').styler({
	  wrapper: 'b-toggle'
	})*/

	if ($('input[data-limit]').length > 0) {
		//range
		jQuery("#filter-slider").slider({
			min: jQuery("input#minCost").data('limit'),
			max: jQuery("input#maxCost").data('limit'),
			values: [parseFloat(del_spaces(jQuery("input#minCost").val())),parseFloat(del_spaces(jQuery("input#maxCost").val()))],
			step: 100,
			range: true,
			stop: function(event, ui) {
				jQuery("input#minCost").val(jQuery("#filter-slider").slider("values",0));
				jQuery("input#maxCost").val(jQuery("#filter-slider").slider("values",1));
				check_nalichie($('#filter-slider'));
			},
			slide: function(event, ui){
				jQuery("input#minCost").val(jQuery("#filter-slider").slider("values",0));
				jQuery("input#maxCost").val(jQuery("#filter-slider").slider("values",1));
			}
		});
	}

    //
    $('.head-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
//        initialSlide: Math.round(Math.random()),
        dots: true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 5000,
        speed: 500
    });

    $('.slider-partns').slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1
    });

    $('.tov-slider-f').slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1
    });

    $('.tov-slider').slick({
        lazyLoad: 'ondemand',
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1
    });

    $('.team-slider').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1
    });

    $('.doc-slider').slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1
    });

    $('.other-products-slider').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: true,
        arrows: true
    });

    if ($('.tov.object').length > 0) catalogEqualHeights();

    $('.fancy').fancybox();
    if($('#boottp').length > 0){
        $('#boottp').val('45789');
    }
    $('.fancy_galery').fancybox({openEffect:'fade',openSpeed: 500});

    $('.js-open').click(function() {
        $(this).hide();
        $(this).parent().next('.info-more').slideDown(300).addClass('info-more-visible');
        return false;
    });

    $('.table-ch.object').each(function() {
        if ($(this).find('tr').length == 0) {
            $(this).prev().addClass('hid');
        }
    });

    $(window).scroll(function() {
        if($(this).scrollTop() > 200) {
            $('.up').fadeIn(300);
        } else {
            $('.up').fadeOut(300);
        }
    });
    $('.up').click(function() {
        $('body,html').animate({scrollTop:0 },800);
        return false;
    });

    //
    $('.deliv-list a, .ancors a').on('click', function(event){
        event.preventDefault();
        $('html,body').animate({scrollTop:$(this.hash).offset().top - 10}, 800);
    });

    // плавный скролл ссылки
    $('a.scroll_smoothly').on('click', function(event){
        event.preventDefault();
        $('html,body').animate({scrollTop:$(this.hash).offset().top - 10}, 800);
    });

    //
    $(".scroll").mCustomScrollbar({
        axis:"y",
        scrollButtons:{enable:false},
        advanced:{autoExpandHorizontalScroll:true},
        scrollInertia: 800
    });

	$(".scroll_x").mCustomScrollbar({
		axis:"x",
		autoExpandScrollbar:true,
        advanced:{autoExpandHorizontalScroll:true},
		scrollInertia: 0,
		callbacks:{
			whileScrolling:function(){
				$(".fixedColumn").css('left',-this.mcs.left);
				/*$(".fixedColumn").text(this.mcs.draggerTop);
				$(".fixedColumn").text(this.mcs.topPct+"%");
				$(".fixedColumn").text(this.mcs.direction);
				$(".fixedColumn").text("60");
				$(".fixedColumn").text("50");*/
			}
		}
	});

	function WhileScrolling(){
		$(".fixedColumn").css('left',mcs.left);
	}

	//
	$(".acc .opener").click(function (){
		//$(this).parent().parent().find('.opener').not($(this)).removeClass('active');
		//$(this).parent().parent().find('.drop').not($(this).next('.drop')).hide();
		$(this).toggleClass('active');
		$(this).next('.drop').toggle(0, function() {
			//console.log($(this).is(':visible'));
			//if ($(this).parent().data('multiple') == 0 && $(this).is(':visible')) {
			if ($(this).is(':visible')) {
				check_nalichie(null);
			}
		});
		return false;
	});

	//.open-search
	$(".open-search").click(function (){
		$('.acc > li.hid').addClass('vis').removeClass('hid');//.show();
		$(this).hide();
		$('.close-search').show();
		return false;
	});
	$(".close-search").click(function (){
		$('.acc > li.vis').addClass('hid');//.hide();
		$(this).hide();
		$('.open-search').show();
		return false;
	});

	//js-open-pop  serios view
	$(".js-open-pop").click(function (){
            //console.log('serios view');
            if($('.search-pop .brand-series-box:not(.hid)').length > 0) {
                $('.search-pop').fadeIn(300);
            }else{
                $('.b-filter-brands__series-btn-bubble').fadeIn(300);
                interval = setTimeout(closePops, 3000);
            }
            return false;
	});
	$(".search-pop .close").click(function (){
		$(this).parent('.search-pop').fadeOut(300);
		return false;
	});

	//
	$(".positions a").click(function (){
		$('.set-cont').toggle();
		return false;
	});
	$(".f-block a.more-local").click(function (){
		$(this).parents('.f-block').find('li.hid').show();
		$(this).hide();
		return false;
	});

    // добавляем GET-параметры к текущему запросу, который будет менять сортировку. Если конечно такой запрос случиться
//    if(jQuery('#navigation_form_area').length > 0){
//        var loc_search = location.search.substring(1); // получаем текущий GET
//        if(loc_search != ''){
//            var prepare_json = '{"' + decodeURI(loc_search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}'; // преобразуем его в JSON
//            prepare_json = prepare_json.replace('"",','').replace(',""',''); // убираем пустые JSON-объекты, ибо они будут невалидны. Такие штуки дают конструции типа ?&filter=1
//            var current_get = JSON.parse(prepare_json); // парсим строку в набор объектов
//            var append_hidden_fields = [];
//            for(var name in current_get){ // генерируем hidden поля с нужными данными
//                if(name != 'sort' && name != 'count'){
//                    append_hidden_fields.push('<input type="hidden" name="' + name + '" value="' + current_get[name] + '" />');
//                }
//            }
//            jQuery('#navigation_form_area form').prepend(append_hidden_fields.join('')); // закидываем в форму
//        }
//    }

    jQuery('.countlist').change(function () {
        var count = $(this).find('option:selected').val();
//        jQuery.cookie('count', count);
//        document.location.reload();
        jQuery('#navigation_form_area #navigation_form_area_count').val(count);
        jQuery('#navigation_form_area #navigation_form_area_submit').click();
    });

    jQuery('.perpages a').click(function () {
        var count = jQuery(this).attr('name');
        jQuery.cookie('count', count);
        document.location.reload();
    });

    jQuery('.sortlist').change(function () {
        var sort = $(this).find('option:selected').val();
//        jQuery.cookie('sort', sort);
//        document.location.reload();
        jQuery('#navigation_form_area #navigation_form_area_sort').val(sort);
        jQuery('#navigation_form_area #navigation_form_area_submit').click();
    });


	//
	$('.box-tab-cont .numb').each(function() {
            var asd = $(this);
            asd.find('span.minus').click(function() {
                var data = asd.find('input').val();
                if(data > 0) {
                    asd.find('input').val(parseInt(data) - 1);
                    $('input[name*="floor"]').val(asd.find('input').val());
                    //$('.graybox .nav-tab__item.active input[type="radio"][name="delivery-id"]').change();
                    refreshprice();
                }
                return false;
            });
            asd.find('span.plus').click(function() {
                var data = asd.find('input').val();
                asd.find('input').val(parseInt(data) + 1);
                $('input[name*="floor"]').val(asd.find('input').val());
                //$('.graybox .nav-tab__item.active input[type="radio"][name="delivery-id"]').change();
                refreshprice();
                return false;
              });
	});

	//
	$('.compare').click(function(){
            var $this = $(this);
            compare_change($this);
            return false;
	});

	function compare_change($this) {
		var url = $this.attr('href'),
		usercmp = $('.user-links .icon-compare').next();
		usercmp_sticky = $('.sticky-box-compare');
		if ($this.hasClass('disabled')) return false;
		$this.addClass('disabled');
		$.get(url, function () {
			//do nothing
			//debugger;
			$this.removeClass('disabled');
			if ($this.hasClass('deletecompare')) {
				$this.removeClass('deletecompare');
				url = url.replace("removeFromCompare","addToCompare");
				var id =  url.replace(/^\/emarket\/addToCompare\//, '').replace(/\/$/, '');
				var name = get_compare_name($this, true);
				var link = get_compare_name($this, false);
				//console.log(id, name, link);
				//$this.attr('href', url);
				if ($this.parents('.compareboxfixed').is('div')) {
					$this.parent().remove();
					var a = $('a[href="/emarket/removeFromCompare/' + id + '/"]');
					a.removeClass('deletecompare').attr('href', url);
				}else{
					$('.floating_compare .compareboxfixed ul').find('a[href="/emarket/removeFromCompare/' + id + '/"]').parent().remove();
					$this.attr('href', url);
				}
				var cnt = parseInt(usercmp.text());
				if (cnt > 0) {
					usercmp.text(--cnt);
					usercmp_sticky.find('span').text(cnt + ' шт.');
					if (cnt == 0) {
						usercmp_sticky.addClass('disabled');
						$('.floating_compare .compareboxfixed').slideUp();
					}
				}
			}else{
				$this.addClass('deletecompare');
				var id =  url.replace(/^\/emarket\/addToCompare\//, '').replace(/\/$/, '');
				var name = get_compare_name($this, true);
				var link = get_compare_name($this, false);
				//console.log(id, name, link);
				$('.floating_compare .compareboxfixed ul').append($('<li><a href="' + link + '">' + name + '</a><a href="/emarket/removeFromCompare/' + id + '/" class="deletecompare compare"><img src="/templates/satra/images/kpk_delete.png" alt="" /></a></li>'));
				url = url.replace("addToCompare","removeFromCompare");
				fix_compare_delete_init();
				$this.attr('href', url);
				var cnt = parseInt(usercmp.text());
				usercmp.text(++cnt);
				usercmp_sticky.find('span').text(cnt + ' шт.');
				usercmp_sticky.removeClass('disabled');
                                // всплывающее окно
                                $('.sticky-box-compare').mouseover();
			}
		});
	}

	function get_compare_name($this, f) {
		var name = '';
		if ($('body').hasClass('m_object')) {
			name = (f) ? $('h1').text() : window.location.href;
		}else{
			name = (f) ? $this.parents('.tov.object').find('.tov-title a').text() : $this.parents('.tov.object').find('a.cover-link').attr('href');
		}
		return name;
	}

	$('.usv h1').click(function() {
		var id = $(this).attr('rel');
		if (id && !$(this).next().is('a')) {
			$('<a href="/admin/catalog/edit/' + id + '/"><img src="/images/cms/admin/mac/tree/ico_catalog_object.png"></img></a>').insertAfter($(this));
			return false;
		}
		var sid = $('.tov-bot a:first').attr('id');
		if (sid) {
			var id = (sid.indexOf('add_basket') != -1) ? sid.replace(/^add_basket_/, '') : false;
			if (id && !$(this).next().is('a')) {
				$('<a href="/admin/catalog/edit/' + id + '/"><img src="/images/cms/admin/mac/tree/ico_catalog_object.png"></img></a>').insertAfter($(this));
			}
		}else{
			var sid = $('.tov-bot a.btn.compare').attr('href');
			var id = (sid.indexOf('/emarket/addToCompare/') != -1) ? sid.replace(/^\/emarket\/addToCompare\//, '') : false;
			if (id && !$(this).next().is('a')) {
				$('<a href="/admin/catalog/edit/' + id + '"><img src="/images/cms/admin/mac/tree/ico_catalog_object.png"></img></a>').insertAfter($(this));
			}
		}
	});


	//
	function showDiv() {
            if ($(window).scrollTop() > 286 && $('.comparison').data('positioned') == 'false') {
                $(".comparison").hide().css({"position": "fixed"}).fadeIn(0).data('positioned', 'true');
                $(".comparison").addClass('fix');
            } else if ($(window).scrollTop() <= 286 && $('.comparison').data('positioned') == 'true') {
                $(".comparison").fadeOut(0, function() {
                    $(this).css({"position": "relative"}).show();
                    $(".comparison").removeClass('fix');
                }).data('positioned', 'false');
            }

            if ($('.des-tovar').length == 0) return;

//            var he1 = $('.des-tovar').offset().top + $('.des-tovar').height() + 47;
//            var he1 = $('.des-tovar').offset().top + $('.des-tovar').height() + $(".abs-block").height() - 60;
            var he1 = $('.state-blocks').offset().top;
            var he2 = $('.state-blocks').offset().top + $(".state-blocks").height() - $(".abs-block").height() + 60;
//            console.log($(window).scrollTop(), he1, he2, $('.state-blocks').offset().top);

            if ($(window).scrollTop() > he1 && $(window).scrollTop() <= he2 && $('.abs-block').attr('data-positioned') == 'false') {
                $(".abs-block").css({"position" : "fixed", "top" : 0, "width" : $('.abs-block-compensator').css('width')}).attr('data-positioned', 'true').addClass('fix');
                $('.abs-block-compensator').css('height', ($(".abs-block").height() + 10) + 'px');
            }else if ($(window).scrollTop() > he1 && $(window).scrollTop() > he2) {
                $(".abs-block").css({"position": "absolute", "top":he2 - 250}).attr('data-positioned', 'false').removeClass('fix');
            }else if ($(window).scrollTop() <= he1 && $('.abs-block').attr('data-positioned') == 'true') {
                $(".abs-block").css({"position": "relative", "top":0}).removeClass('fix').attr('data-positioned', 'false');
                $('.abs-block-compensator').css('height', '0px');
            }
	}

        showDiv();
	$(window).scroll(showDiv);
	$('.comparison').attr('data-positioned', 'false');
	$('.abs-block').attr('data-positioned', 'false');

	function showDivq() {
            var he1 = ($('.center').is('div')) ? $('.center').offset().top + $('.center').height() : 0;
            if($('.one_center').length > 0){
                he1 = ($('.one_center').is('div')) ? $('.one_center').offset().top + $('.one_center').height() : 0;
            }
            var he11 =  ($('.sidebar').is('div')) ? $('.sidebar').offset().top + $('.sidebar').height() : 0;
            he1 = (he1 > he11) ? he1 : he11;
            var he2 = $('#footer').offset().top + $("#footer").height() - $(".sticky-box").height();

            $(".sticky-box").hide().css({"position": "fixed", "bottom":0}).fadeIn(0).data('positioned', 'true');
            $(".sticky-box").addClass('fix');

            if (($(window).scrollTop() + $(window).height() - 85) >= he1 && $('.sticky-box').data('positioned') == 'true') {
                $(".sticky-box").fadeOut(0, function() {
                    $(this).css({"position": "absolute", "bottom": 0}).show();
                    $(".sticky-box").removeClass('fix');
                }).data('positioned', 'false');
            }
	}

	$(window).scroll(showDivq);
	$('.sticky-box').data('positioned', 'false');

	//tabs
	$('.pane:first-child').addClass('active');
	$('.tabs li:first-child').addClass('active');
	$('.tabs li a').click(function() {
	  var idx = $(this).parent().index();
	  $('.pane').not($('.pane').eq(idx)).removeClass('active');
	  $('.pane').eq(idx).addClass('active');
	  $('.tabs li').removeClass('active');
	  $(this).parent('li').addClass('active');
	  return false;
    });

    //
    $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        asNavFor: '.slider-nav',
        arrows: false
    });
    $('.slider-nav').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        dots: false,
        arrows: false,
        centerMode: false,
        focusOnSelect: true,
        infinite: false
    });
    $('.slider-nav').on('mouseenter', '.slick-slide', function (e) {
        var $currTarget = $(e.currentTarget),
            index = $currTarget.data('slick-index'),
            slickObj = $('.slider-for').slick('getSlick');
        slickObj.slickGoTo(index);
    });

    $('.slider-nav').on('click', '.slick-slide', function (e) {
        var $currTarget = $(e.currentTarget),
            index = $currTarget.data('slick-index'),
            slickObj = $('.slider-modal-for').slick('getSlick');
        slickObj.slickGoTo(index);
    });

    var $self = $(this), $window = $(window), w = 1200, h = 900;
    try {
        $(".fancy_modal").fancybox({
            'hideOnContentClick': true,
            width: '1200px',
            height: '900px',
            beforeLoad: function () {
                var players = {}
                , slideFor, slideNav, padding = 145;

                //Aspect
                if (h > $window.height()) {
                    h = $window.height() - 40;
                    w = w / (w / h);
                } else if (w > $window.width()) {
                    w = $window.width() - 70;
                    h = h / (w / h);
                } else {
                    if (w < 500) {
                        w = 500;
                    }
                }
                //console.log($('body').width(), $('body').height());
                //$('#modal').css({'width': $('body').width() / 1.2, 'height': $('body').height() / 1.2});
                var mh = $('body').height() / 1.05;
                var mh2 = mh - 150;
                $('#modal').css({'width': w, 'height': h, 'padding': 0});
                if($('#video_file').length > 0){
                    $('#video_file').css({'width': w * 0.8, 'height': (w * 0.8 * 305 / 420)});
                }
                //$('.slider-modal-for .slick-slide img').css('max-height', mh2);
            },
            afterLoad: function () {
                //console.log(33);
                var $currTarget = $('.slider-for .slick-slide.slick-current');
                index = $currTarget.data('slick-index');
                slickObj = $('.slider-modal-for').slick('getSlick');
                slickObj.slickGoTo(index);

                var players = {}
                , slideFor, slideNav, padding = 145;

                //Подгон картинок
                $('.fancybox-inner .slider-modal-for .slick-slide').css('width', w + "px");
                $('.fancybox-inner .slider-modal-for .slick-slide img').css('max-width', w - padding + "px");
                $('.fancybox-inner .slider-modal-for .slick-slide img').css('max-height', h - padding + "px");
                $('.fancybox-inner .slider-modal-for').css('height', h - $('.fancybox-inner .slider-modal-nav').height() - 100);
                //$('.fancybox-inner .slider-modal-for .slick-track').css('padding-left', "45px");
                //$('.fancybox-inner .slider-modal-for .slick-slide img').css('max-height','500px');
            },
            afterClose: function () {
                //console.log(44);
            }
        });
    } catch (e) {
    }

    // минигаллерея при открытии картинки в всплывающем окне
    $('.slider-modal-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: '.slider-modal-nav',
        centerMode: true,
        centerPadding: '0px',
        arrows: true
    }).on("beforeChange", function (event, slick, currentSlide, nextSlide) {
        if(document.getElementById('video_file') !== null){
            document.getElementById('video_file').contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
    }).on("afterChange", function (event, slick, currentSlide, nextSlide) {
        if($('.slick-slide-video.slick-active').length > 0){
            $('.slick-arrow').addClass('short');
        }else{
            $('.slick-arrow').removeClass('short');
        }
    });
    $('.slider-modal-nav').slick({
        slidesToShow: 10,
        slidesToScroll: 1,
        asNavFor: '.slider-modal-for',
        dots: false,
        arrows: false,
        centerMode: true,
        focusOnSelect: true,
        centerPadding: '0px',
        infinite: false
    });

	// On before slide change
	$('.slider-modal-for').on('afterChange', function(event, slick, currentSlide){
	  slickObj = $('.slider-modal-nav').slick('getSlick');
	  //slickObj.slickGoTo(currentSlide);
	  //slickObj.slickNext();
	  //$('.slider-modal-nav').slick('setPosition');

	  $('.fancybox-inner .slider-modal-for .slick-slide img').css({'max-height':h - $('.fancybox-inner .slider-modal-nav').height() - 100, 'max-width': w - 145 +"px"});
	  $('.fancybox-inner .slider-modal-for').css('height', h - $('.fancybox-inner .slider-modal-nav').height() - 100);
		$('.slider-modal-nav .slick-slide[data-slick-index = ' + currentSlide + ']').siblings().removeClass('slick-current').removeClass('slick-center').end().addClass('slick-current').addClass('slick-center');
	});


	//
	$(".more-par").click(function (){
		$('.table-ch .hid').toggleClass('open');
		//$('.title.hid').show();
		$('.table-ch.object').each(function() {
			if ($(this).find('tr:visible').length > 0) {
				$(this).addClass('open').prev().addClass('open');
			}else{
				$(this).removeClass('open').prev().removeClass('open');
			}
		});
		//$(this).hide();

		$(this).text(function(i, text){
			return text === "Все характеристики" ? "Свернуть характеристики" : "Все характеристики";
		});

		return false;
	});


	//show-map
	$(".show-map").click(function (){
		$(this).parents('.address-item').find('.map-hid').toggleClass('open');
		return false;
	});

	//brend
	$(".brend .more").click(function (){
		$(this).parents('.brend').find('li.hid').show();
		$(this).hide();
		return false;
	});

	//more-local
	$(".acc .more-local").click(function (){
		$(this).parent('.drop').find('.hid').toggle();
		return false;
	});


	// op-drop
	$(".op-drop").click(function (){
		$(this).parents('.state-in').find('.drop-block').toggle();
		return false;
	});

	//close-block
	$(".close-block").click(function (){
		$(this).next('.b-toggle').toggle();
		$(this).toggleClass('closed');
		return false;
	});

	//
	$(".b-toggle .show-all").click(function (){
		$(this).toggleClass('open').parents('.b-toggle').find('.state-in.hid').slideToggle(100);
		if ($(this).hasClass('open')) {
			$(this).data('text', $(this).text()).text('Свернуть');
		}else{
			$(this).text($(this).data('text'));
		}
		return false;
	});

	//
	$(".acc-li .opener").click(function (){
		$(this).next('.drop').toggle();
		$(this).toggleClass('active');
	});

	//choosed pay
	$(".js-pay-choose").click(function (){
		$(this).parent().addClass('choosed-pay');
		$(this).parent().siblings().removeClass('choosed-pay');
		return true;
	});

	//order-tab
 	$('.tabs-order li a').click(function(){
  		$(this).parents('.tabs-order-wrap').find('.tabs-order-cont').addClass('hide');
  		$(this).parent().siblings().removeClass('active');
  		var id = $(this).attr('href');
  		$(id).removeClass('hide');
  		$(this).parent().addClass('active');
		var floor = $(this).data('floor');
		if (floor >= -1) {
			//console.log( floor);
			if (floor == 1) {
				$('input[name*="floor"]').val($('input#etag').val());
			}else{
				$('input[name*="floor"]').val(floor);
			}
		}else{
			//$('input[name="delivery-id"]').removeAttr('checked');
			$(this).find('input').prop('checked', true);
		}
		$('.graybox input[type="radio"][name="delivery-id"]').change();
  		$(window).resize();
  		return false;
  	});


	(function(){
		var number = $('.versions-table table tr').length - 1;
		$('.js-versions-table .number').text(number);
	}());



	$('.js-versions-table').on('click', function(){
		var heightTable = $('.versions-table-table table').height();

		if (!$(this).hasClass('open')) {
			$(this)
				.addClass('open')
				.find('.text')
				.text('Скрыть');
			$(this)
				.find('.arrow')
				.css({
					'border-left': '6px solid transparent',
					'border-right': '6px solid transparent',
					'border-bottom': '10px solid #fff',
					'border-top': 0
			});
			$(this)
				.parents('.versions-table')
				.addClass('active');
			$(this)
				.parents('.versions-table')
				.find('.versions-table-table')
				.height(heightTable);
		} else {
			$(this)
				.removeClass('open')
				.find('.text')
				.text('Показать все');
			$(this)
				.find('.arrow')
				.css({
					'border-left': '6px solid transparent',
					'border-right': '6px solid transparent',
					'border-top': '10px solid #fff',
					'border-bottom': 0
			});
			$(this)
				.parents('.versions-table')
				.removeClass('active');
			$(this)
				.parents('.versions-table')
				.find('.versions-table-table')
				.height(320);
		}
	});


	// Обработка фильтра
	$('.sel-params .remove').click(function(event) {
            if($(this).hasClass('to_parent')){
                return true;
            }
            event.preventDefault();
            var obj = $(this);
            filter_form_clear(obj);
            get_url();
            return false;
	});

	$('.price-range a').click(function() {
		var obj = $(this);
		$('#minCost').val(obj.data('min'));
		$('#maxCost').val(obj.data('max'));
		jQuery("#filter-slider").slider('values', [obj.data('min'), obj.data('max')]);
		check_nalichie(obj);
		//check_nalichie($('#filter-slider'));
		return false;
	});

	$('.search-big input[type="checkbox"]').change(function() {
		var obj = $(this);
		//console.log('check click');
		var checked = obj.is(':checked');
		var name = obj.data('name');
		if (name == 'brand') {
			$('.search-pop').hide();
			var brand_id = obj.val();
			if (checked)
				$('.search-pop .brand-series-box[id="brand_' + brand_id + '"]').removeClass('hid');
			else{
				$('.search-pop .brand-series-box[id="brand_' + brand_id + '"]').addClass('hid');
				$('.search-pop .brand-series-box[id="brand_' + brand_id + '"]').find('.checks input[type="checkbox"]').prop("checked", false).removeAttr('checked');
			}
		}
		check_nalichie(obj);
	});

	$('.search-big input[type="text"]').change(function() {
		var obj = $(this);
		//console.log('input change');
		check_nalichie(obj);
	});

	$('.search-big .search-bot a:first, .b-found__show-btn').click(function() {
		var obj = $(this);
		if ($('.found-num').hasClass('zero')) 	{
			return false;
		}
		get_url();
		//window.location.href = '?' + msg;
		return false;
	});

	$('.btn-bord-w.clear-search').click(function() {
		var obj = $(this);
		filter_form_clear(obj);
		get_url();
		//window.location.href = '?' + msg;
		return false;
	});

	$('body').click(function() {
		if (!interval)	{
			closePops();
		}
	});

	// Обработка наборов

	$('.state-blocks input[type="checkbox"]').change(function() {
		var obj = $(this);
		var checked = obj.is(':checked');
		if (obj.attr('rel') == 'par') {
			//console.log('check par click');
			var slide = obj.parents('.slide');
			if (slide.parent().hasClass('owl-item')) {
				slide.parent().addClass('checked').siblings().removeClass('checked').find('input').prop("checked", false).removeAttr('checked');
			}else{
				slide.addClass('checked').siblings().removeClass('checked').find('input').prop("checked", false).removeAttr('checked');
			}
			$('.state-varxar .check input:checkbox').trigger('refresh');
			var id = obj.data('id');
			var action = (checked) ? 'add' : 'del';
			var group = obj.data('type');
			ChangePar(id, action, group);
		}else{
			//console.log('check nabor click');
			var id = obj.data('pageid');
			var action = (checked) ? 'add' : 'del';
			if (obj.attr('rel')) {
				ChangeNabor(id, action);
			}else{
				// service
			}
		}
	});

	$('.state-blocks input[type="radio"]').change(function(e) {
	    e.preventDefault();
		var obj = $(this);
		//console.log('check radio nabor change');
		var state = obj.parents('.state-in');
		var btoggle = obj.parents('.b-toggle');
		var selected = btoggle.find('.state-in.checked');
		var checked = obj.is(':checked');
		state.addClass('checked').siblings().removeClass('checked');
		//$('.check input:radio').trigger('refresh');
		var id = obj.data('pageid');
		var action = (checked) ? 'add' : 'del';
		selected.each(function() {
			var id = $(this).find('input').data('pageid');
			ChangeNabor(id, 'del');
		});
		ChangeNabor(id, action);
	});

	$('.state-blocks input[type="radio"]').click(function(e) {
		var obj = $(this);
		//console.log('radio click');
		var state = obj.parents('.state-in');
		if (state.hasClass('checked') && state.parents('.b-toggle').hasClass('c_or_0')) {
			//e.preventDefault();
			//console.log('active click');
			obj.prop("checked", false).removeAttr('checked');
			state.removeClass('checked');
			var id = obj.data('pageid');
			ChangeNabor(id, 'del');
		}
	});

	var div1 = $('.bord .check.v2[data-sort="z9999"]:first');
	var div2 = $('.bord .check.v2:first');
	var divs = $('.bord .check.v2');
	if (divs.index(div1) != divs.index(div2)) 	{
            ($('<div class="filter-brands__brand-separator"/>')).insertBefore(div1);
	}

	try {
            //console.log($.cookie("nocache"));
            var c = $.cookie("nocache");
            if (c == 1) {
                $('input[name="nocache"]').attr('checked', 'checked');
            }
            //$('input[name="nocache"]')
            $('input[name="nocache"]').change(function() {
                var status = $(this).is(':checked') ? 1 : 0;
                $.cookie("nocache", status, { expires: 86400,  path: '/'});
            });
	} catch(err) {
	};

	$('<div id="vx" style="display:none;"/>').appendTo('body');
	$('.state-varxar .state-c').clone().appendTo($('#vx'));

	$('.state-varxar .state-c').each(function() {
            var owl = $(this).find('.owl-carousel');

            if ($(this).find('.slide.item').length > 8) {
                $(this).find('a.more').removeClass('hid');

                init_owl(owl);
                $(this).find('a.more').click(function() {
                    owl = $(this).parent().find('.owl-carousel');
                    $(this).toggleClass('open');
                    $(this).text(function(i, text){
                        return text === "Показать все" ? "Свернуть" : "Показать все";
                    });
                    if ($(this).hasClass('open')) {
                        owl.trigger('destroy.owl.carousel');
                        owl.addClass('full');
                        owl.find('.slide').appendTo(owl);
                        owl.find('.owl-stage-outer').remove();
                    }else{
                        owl.removeClass('full');
                        init_owl(owl);
                    }
                    return false;
                });
            }
	});


	function init_owl(owl) {
		try {
			owl.owlCarousel({
				loop:false,
				margin: 0,
				nav:true,
				dots:false,
				slideBy:8,
				responsive:{
					0:{
						items:1
					},
					700:{
						items:7
					},
					1000:{
						items:8
					}
				}
			});
		}
		catch(err) {
		};
		$('.owl-prev').addClass('arrow_disabled');

		owl.on('changed.owl.carousel', function(event) {
			// Provided by the core
			var element   = event.target;         // DOM element, in this example .owl-carousel
			var name      = event.type;           // Name of the event, in this example dragged
			var namespace = event.namespace;      // Namespace of the event, in this example owl.carousel
			var items     = event.item.count;     // Number of items
			var item      = event.item.index;     // Position of the current item
			// Provided by the navigation plugin
			var pages     = event.page.count;     // Number of pages
			var page      = event.page.index;     // Position of the current page
			var size      = event.page.size;      // Number of items per page
			//console.log(event.item.count, event.item.index);
			if (event.item.index >= event.item.count - 8){
                            $(element).find('.owl-next').addClass('arrow_disabled');
                        } else{
                            $(element).find('.owl-next').removeClass('arrow_disabled');
                        }
			if (event.item.index == 0){
                            $(element).find('.owl-prev').addClass('arrow_disabled');
                        } else {
                            $(element).find('.owl-prev').removeClass('arrow_disabled');
                        }

		});
	}

	$('.abs-block .btn-green').click(function() {
            if ($(this).hasClass('incart')) {
                window.location.href = '/emarket/cart/';
                return false;
            }

            var id = this;
            if(this.rel.indexOf('add_basket') != -1){
                id = this.rel.replace(/^add_basket_/, '');
            } else if($(this).data('rel').indexOf('add_basket') != -1){
                id = $(this).data('rel').replace(/^add_basket_/, '');
            }
//            var id = (this.rel.indexOf('add_basket') != -1) ? this.rel.replace(/^add_basket_/, '') : this;
//            console.log(id, 'add nabor to cart');
            site.basket.add(id, this);

            return false;
	});


	/* compare */

	$('.sticky-box-compare a').click(function() {
		if ($(this).parents('.sticky-box-compare').hasClass('disabled')) {
			return false;
		}
	});

	$('.sticky-box-compare').mouseover(function() {
		clearTimeout(popup_sticky_interval);
		if ($(this).hasClass('disabled')) {
			return false;
		}
		$('.compareboxfixed').stop().slideDown(200);
	});

	$('.compareboxfixed').mouseleave(function() {
		popup_sticky_interval = setTimeout(closeStickyPopUp, 1000);
	});
	//$('.sticky-box-compare').mouseleave(function() {
		//popup_sticky_interval = setTimeout(closeStickyPopUp, 100);
	//})
	$('.sticky-box-price, .sticky-box-relations').mouseover(function() {
		popup_sticky_interval = setTimeout(closeStickyPopUp, 100);
	});

	$('.compareboxfixed').mousemove(function() {
		clearTimeout(popup_sticky_interval);
	});

	function closeStickyPopUp() {
		clearTimeout(popup_sticky_interval);
		//console.log('closeStickyPopUp');
		$('.compareboxfixed').stop().slideUp(200);
	}


	//$('#main_compare_page_js').ready(function() {
            var url = "/udata/emarket/getCompareList/?transform=modules/ajax/compare.ajax.xsl";
            jQuery.ajax({
                url : url,
                cache : false,
                dataType : 'html',
                success : function(data) {
                    var cnt = $(data).find('li').length;
                    $("#main_compare_page_js span").text(cnt);
                    var usercmp_sticky = $('.sticky-box-compare');
                    usercmp_sticky.find('a span').text(cnt + ' шт.');
                    if (cnt > 0) {
                        usercmp_sticky.removeClass('disabled');
                        $('.compareboxfixed').html(data);
                        $('.btn.compare').each(function(){
                            $(this).attr('href', '/emarket/addToCompare/' + $(this).data('id')).removeClass('deletecompare');
                        });
                        $('.compareboxfixed li').each(function(){
                            if($('.btn.compare.compare_' + $(this).data('id')).length > 0){
                                $('.btn.compare.compare_' + $(this).data('id')).each(function(){
                                    $(this).attr('href', '/emarket/removeFromCompare/' + $(this).data('id')).addClass('deletecompare');
                                });
                            }
                        });
                        fix_compare_delete_init();
                    }else{
                        $('.compareboxfixed').html('<ul></ul>');
                    }
                }
            });
	//});

//    jQuery.ajax({
//        url : "/udata/custom/getUserLinks/?transform=modules/ajax/header.users_links.ajax.xsl",
//        cache : false,
//        dataType : 'html',
//        success : function(data) {
//            $("#header-user-links-user").html(data);
//            $('#poplogin').appendTo($('#content > .cont-in'));
//
//            if($(data).find('.logout').length > 0) {
//                $('.user-links.popup').addClass('active');
//            } else {
//                $('#poplogin input.code').inputmask("999", {
//                    onKeyValidation: function () {
//                        popup_keypressed = true;
//                    },
//                    oncomplete : function () {
//                        var input = $('#poplogin input.tel');
//                        input.focus().setCursorPosition(input.val().length);
//                    }
//                });
//                $('#poplogin input.tel').inputmask("999-99-99", {
//                    onKeyValidation: function () {
//                        popup_keypressed = true;
//                    },
//                    oncomplete : function () {
//                        if($('#poplogin input.code').val().substr(0,1) === '9'){
//                            var url = "/udata/users/check_phone?phone=" + '(' + $('#poplogin input.code').val() + ')' + $(this).val();
//                            jQuery.ajax({
//                                url : url,
//                                cache : false,
//                                dataType : 'xml',
//                                success : function(data) {
//                                    var id = parseInt($(data).find('udata').text());
//                                    $('.m-phone').show();
//                                    $('.auth_button').hide();
//                                    if (id > 0) {
//                                        $('#poplogin .title').text('Вход в личный кабинет');
//                                        popup_error_clear($('#poplogin'));
//                                        $('#poplogin  .phonebox').removeClass('init');
//                                        $('.auth_reg').slideUp();
//                                        $('.auth_password').slideDown();
//                                    }else{
//                                        $('#poplogin .title').text('Регистрация');
//                                        popup_error_clear($('#poplogin'));
//                                        $('#poplogin  .phonebox').removeClass('init');
//                                        $('.auth_password').slideUp();
//                                        $('.auth_reg').slideDown();
//                                        var feel = false;
//                                        $('#poplogin .auth_reg input[type="text"]').each(function() {if ($(this).val().length > 0){feel = true;}});
//                                        if (feel) 	{
//                                            var check = popup_validation_test('#popup_registrate');
//                                        }
//                                    }
//                                }
//                            });
//                        }else{
//                            $('#poplogin input.code').focus();
//                        }
//                    }
//                });
//            }
//        }
//    });

	function fix_compare_delete_init() {
            $('.compare.deletecompare').click(function(){
                var $this = $(this);
                compare_change($this);
                return false;
            });
	}

	/* cart */
        update_cart();
//	//$('#main_cart_page_js').ready(function() {
//		var url = "/udata/emarket/getcart/?transform=modules/ajax/cart.ajax.xsl";
//		//var url = "/udata/emarket/cart/.json";
//		jQuery.ajax({
//			url : url,
//			cache : false,
//			dataType : 'html',
//			success : function(data) {
//				$("#main_cart_page_js").html(data);
//				var totalprice = parseFloat($('.basket_info_summary').data('totalprice'));
//				var text = $('.basket_info_summary').text();
//				var text_sum = numeric_format(totalprice, ' ');
//				if (totalprice > 0) {
//					$('.sticky-box-price').removeClass('disabled').find('.number').text(text + ' шт. ').end().find('.price').html(text_sum + ' <span class="rub">руб.</span>');
//				}
//			}
//		});
//	//});

	$('.sticky-box-price').click(function() {
		if ($(this).hasClass('disabled')) {
			return false;
		}
		window.location.href = '/emarket/cart/';
	});

	if ($('#checkout').length > 0) {

		// check restored radio and checkbox

		var inp = $('input[name="payment-id"]:checked');
		var pay_tab_index = inp.parents('.choose-pay-list').find('.choose-pay-list__item').index(inp.parents('.choose-pay-list__item'));
		//console.log(inp.val(), pay_tab_index);
		if (pay_tab_index > 0) {
			inp.parents('.choose-pay-list').find('.choose-pay-list__item').siblings().removeClass('choosed-pay').eq(pay_tab_index).addClass('choosed-pay');
			//inp.prop("checked", true).attr('checked', true);
		}

		var inp = $('input[name="delivery-id"]:checked');
		var delivery_tab_index = inp.parents('.nav-tab-list').find('.nav-tab__item').index(inp.parents('.nav-tab__item'));
		//console.log(inp.val(), delivery_tab_index);
		if (delivery_tab_index > 0) {
			inp.parents('.nav-tab-list').find('.nav-tab__item').siblings().removeClass('active').eq(pay_tab_index).addClass('active');
			inp.parents('.tabs-order-wrap').find('.tabs-order-cont').addClass('hide').eq(delivery_tab_index).removeClass('hide');
			$('.order-step.step4').hide();
		}

		// Если восстановился номер этажа активировать соответствующую вкладку
		var floor = $('input[name="data[new][floor]"]');
		if (floor.val() == -1) floor.parent().find('.nav-tab__item').siblings().removeClass('active').eq(2).addClass('active');
		if (floor.val() > 0) floor.parent().find('.nav-tab__item').siblings().removeClass('active').eq(1).addClass('active');

		$('.graybox .required.field.field_fname input').attr('required', 'required');
		$('input[type="text"]').addClass('textinputs');
		$('.delivery-address').insertBefore('.delivery_choose');
		if ($('.graybox .delivery-address input[type="radio"]').attr('checked') == 'checked' ) {
			//$('.graybox .delivery_choose input[type="radio"]').removeAttr('checked');
			$('.deliveryaddressesinfo').hide('fast');
			$('.deliveryaddressesinfo input:required').attr('rel', '1').removeAttr('required');
		}else{
			//$('.graybox .delivery-address input[type="radio"]').removeAttr('checked');
			$('.deliveryaddressesinfo').show('fast');
			$('.deliveryaddressesinfo input[rel="1"]').attr('required', 'required');
		}
		//$('.graybox input[type="radio"]').change(function(){
		$('.graybox input[type="radio"][name="delivery-id"]').change(function(){
			refreshprice();
			//debugger;
			//console.log($(this).attr('rel'), $(this).parents('.nav-tab__item').hasClass('active'));
			var tabactive = $(this).parents('.nav-tab__item').hasClass('active');
			if ($(this).attr('rel') == 'self' && tabactive) {
				//$('.graybox .delivery_choose input[type="radio"]').removeAttr('checked');
				//$('.deliveryaddressesinfo').hide('fast');
				$('.deliveryaddressesinfo input:required').attr('rel', '1').removeAttr('required');
				$('.delivery-address input[name="delivery-address"]').attr('value', '');
				$('.order-step.step4').slideUp();
			}else{
				//$('.graybox .delivery-address input[type="radio"]').removeAttr('checked');
				//$('.deliveryaddressesinfo').show('fast');
				$('.deliveryaddressesinfo input[rel="1"]').attr('required', 'required');
				$('.delivery-address input[name="delivery-address"]').attr('value', 'new');
				$('.order-step.step4').slideDown();
			}
		});
	}



	function refreshprice() {
		//debugger;
		var pricedelivery = 0;
		var pd = $('.graybox input[name="delivery-id"]:checked');
		if (pd.length > 0) {
			pricedelivery = parseFloat(pd.data('price'));
		}
		var pricetotal = parseInt($('.cart_summary.size3').data('price'));
		var pricetotal2 = 0;
		$('.basket span.size2').each(function(){
			pricetotal2 = pricetotal2 + parseInt($(this).text());
		});
		// Лифт
		var pricelift = 0;
		if (!$('#tab_2').hasClass('hide')) {
		} else {
			if (!$('#tab_3').hasClass('hide')) {
				pricelift = parseInt($('#tab_3 .size4').data('price'));
			}else
			if (!$('#tab_4').hasClass('hide')) {
				//debugger;
				var startprice = parseInt($('#tab_4 .size4').data('price'));
				var etagprice = parseInt($('#tab_4 .size4').data('etagprice'));
				var et = parseInt($('input[name*="floor"]').val());
				pricelift = startprice + etagprice * et;
				pricelift = 0;
				//$('#tab_4 .size4').text((pricelift).toLocaleString('ru'));
				$('#tab_4 .size4').text('уточнит менеджер');
			}
		}
		pricedelivery = pricedelivery + pricelift;
		//var total = pricetotal + pricedelivery + pricelift;
		var total = pricetotal;

		/*if (pricetotal != pricetotal2)	{
			$('#basket_summary_price').text(pricetotal2);
		}*/
		//$('.delivery-sum').text((pricedelivery).toLocaleString('ru') + ' <span class="rub">руб.</span>');
		if ((!$('#tab_2').hasClass('hide'))) {
			$('.delivery-sum').html(('0').toLocaleString('ru') + '<span class="rub">руб.</span>');
		} else {
			$('.delivery-sum').text(('Уточнит менеджер').toLocaleString('ru'));
		}
		$('.sum').html((total).toLocaleString('ru')  + '<span class="rub">руб.</span>');

	}

	if ($('#checkout').length > 0) {
		refreshprice();
	}

	/* phone mask */

	if ($('input[name*=phone], input.phone').length > 0) {
		//console.log('---- phone mask ---------');
		$('input[name*=phone], input.phone').inputmask("phoneru", {
				onKeyValidation: function () { //show some metadata in the console
				//console.log($(this).val());
				$(this).removeClass('complete');
				$(this).removeClass('error').parents('.box-field').removeClass('error-field');
				if ($(this).val()) $(this).removeClass('placeholder');
			},
				oncomplete : function () {
					$(this).addClass('complete');
			}
		});
	}

    if($('.ral_color').length > 0){
        $('.ral_color').click(function(){
            if(!$(this).hasClass('no_select')){
                $('.ral_color_show').css('background-color', '' + $(this).data('color')).css('background-image', 'none');
                $('.ral_color_input').val($(this).data('name'));
                $('.ral_color_input').data('value', 'RAL ' + $(this).data('name'));
                $('.ral_color_input').data('name', $('.ral_color_input').data('type') + ' RAL ' + $(this).data('name'));
                $.fancybox.close();
                ChangePar($('.ral_color_input').data('id'), 'add', $('.ral_color_input').data('type'));
            }
        });
        $('.ral_color_input').change(function(){
            val = $(this).val();
            $('.ral_color').each(function(){
                if($(this).data('name') == val){
                    $('.ral_color_show').css('background-color', '' + $(this).data('color')).css('background-image', 'none');
                }
            });
            var canvas = document.getElementById("canvas");
            var img = canvas[0].toDataURL("image/png", 1.0);
            $('.ral_color_input').parents('.slide').find('.img img').attr('src', img);
            $('.ral_color_show').css('background-color', '' + $(this).data('color'));
            $(this).data('value', 'RAL ' + $(this).val());
            $(this).data('name', $(this).data('type') + ' RAL ' + $(this).val());
            $.fancybox.close();
            ChangePar($(this).data('id'), 'add', $(this).data('type'));
        });
    }

    // галочка "интересует установка этого товара" в корзине
    $('input.is_interes_exist').change(function(){
        var checked = 0;
        if(this.checked){
            checked = 1;
        }
        $.ajax({
            url: "/udata/emarket/set_interes/" + $(this).data('id') + '/' + checked + '/' + $(this).data('name')
        });
    });

    // "вернуться в каталог" из сравнения
    $('.btn-back.btn-back-compare').click(function(event){
        if(window.history.length > 0){
            event.preventDefault();
            var history_from_compare = $(this).data('history_from_compare');
            if(history_from_compare == null){
                history.back();
            }else{
                history.go(history_from_compare);
            }
        }
    });

    // записываем в куки сколько раз было удаление из сравнения
    $('.remove_from_compare').click(function(event){
        var history_from_compare = $('.btn-back.btn-back-compare').data('history_from_compare');
        if(history_from_compare == null){
            history_from_compare = -1;
        }
        $.cookie('history_from_compare', history_from_compare - 1, {expires: 0.003});
    });

    // записываем в кнопку "вернуться в каталог" количество удалений, чтобы знать, как глубоко по истории вернуться
    if($('.btn-back.btn-back-compare').length > 0 && $.cookie('history_from_compare') !== null){
        $('.btn-back.btn-back-compare').data('history_from_compare', $.cookie('history_from_compare'));
        $.cookie('history_from_compare', null);
    }

    $('.history-back').click(function(event){
        if(window.history.length > 0){
            event.preventDefault();
            history.back();
        }
    });

    $('.btn.btn-gray.no_sale_nabor').click(function(event){
        event.preventDefault();
    });

    // прячем секции других товаров из коллекции, если в них нет товаров
    $('.check_child_count').each(function(){
        if($(this).find('.tov-slider .tov.object').length === 0){
            $(this).addClass('hide');
        }
    });

    if($('.other-products-area .check_child_count:not(.hide)').length === 0){
        $('.other-products-area').addClass('hide');
    }

    // стартуем eskju.jquery.scrollflow.js
    new ScrollFlow();


    // навигация шоурум
    $('.album_change').click(function(event){
        event.preventDefault();
        $('.album_content').fadeOut(400);
        $('.album_content_'+$(this).data('id')).fadeIn(700);
        $('.album_change').removeClass('active');
        $(this).addClass('active');
    });

    // показать еще шоурум
    $('.showroom-button.show-galery').click(function(event){
        event.preventDefault();
        var id = $(this).data('id');
        $.ajax({
            url: "/udata/photoalbum/album/" + $(this).data('id') + "//8/?p=" + $(this).data('page') + "&transform=modules/photoalbum/ajax-showroom.xsl",
            dataType: "html"
        }).done(function (data){
            $('.showroom-gallery-all-images-area-' + id).append(data);
            $('.showroom-button-' + id).data('page', $('.showroom-button-' + id).data('page') + 1);
            if($('.showroom-gallery-all-images-area-' + id).find('.is_last_photos').length !== 0){
                $('.showroom-button-' + id).hide();
            }
        });
    });

    $('a.btn-back').click(function(){
        parent.history.back();
        return false;
    });
});

var showroom_map;
$(document).ready(function() {
    // карта на шоуруме - раскрытие
    $('.show_showroom_map').click(function (event) {
        event.preventDefault();
        $('#showroom_map_area').slideToggle(400);
    });


    // карта на шоуруме - отрисовка
    if($('#showroom_map').length > 0){
        ymaps.ready(init);
        function init() {
            showroom_map = new ymaps.Map('showroom_map', {
                center: [55.625182, 37.426973],
                zoom: 12
            });
            showroom_placemark = new ymaps.Placemark([55.635762, 37.369431], {content: 'Satra', balloonContent: 'Шоурум САТРА<br />Новоорловская, 3,<br />строение 2, этаж 2'});
            showroom_map.geoObjects.add(showroom_placemark);
            showroom_placemark = new ymaps.Placemark([55.614188, 37.484883], {content: 'Satra', balloonContent: 'Шоурум САТРА<br />41км. МКАД<br />ТК “Славянский Мир“<br />А27/1, Б19/1, В19/1'});
            showroom_map.geoObjects.add(showroom_placemark);

            showroom_map.controls.add(new ymaps.control.ZoomControl());
            showroom_map.behaviors.disable('scrollZoom');
        }
    }
});

function update_cart(){
    var url = "/udata/emarket/getcart/?transform=modules/ajax/cart.ajax.xsl";
    jQuery.ajax({
        url: url,
        cache: false,
        dataType: 'html',
        success: function (data) {
            $("#main_cart_page_js").html(data);
            var totalprice = parseFloat($('.basket_info_summary').data('totalprice'));
            var text = $('.basket_info_summary').text();
            var text_sum = numeric_format(totalprice, ' ');
            if (totalprice > 0) {
                $('.sticky-box-price').removeClass('disabled').find('.number').text(text + ' шт. ').end().find('.price').html(text_sum + '<span class="rub">руб.</span>');
            }
        }
    });
}

function tovarImgTipso() {
	$('.tovar-img.tipso').tipso({position: 'bottom', background: '#999', color: '#333', size: 'small',
		onBeforeShow: function ($element, element) {
			// Your code
			if ($element.attr('data-tipso')) {
				$element.tipso('update', 'content', '<div style="min-height: 100px"><img src="' + $element.attr('data-tipso') + '"></img></div>');
			}else{
				$element.tipso('update', 'content', '<img src="/images/no_foto.png" style="width:232px"></img>');
			}
		}
	});
}

function closePopup() {

	$.magnificPopup.close();

	return;

	var newImageWidth = 0;
	var newImageHeight = 0;
	var gotoX = 0;
	var gotoY = 0;

	jQuery(".mfp-content")
	//.clone()
	//.prependTo("#photo_" +id)
	//.css({'position' : 'absolute'})
	.addClass('test')
	//.animate({opacity: 0.6}, 100 )
	//.animate({opacity: 0.4, right: gotoX, top: gotoY, width: newImageWidth, height: newImageHeight}, 1200, function() {
	.animate({opacity: 0}, 100, function() {
		//jQuery('img.test').remove();
	});

}

function ChangeNabor(id, action) {
	//console.log('ChangeNabor', id, action);
	if (action == 'del') {
		$('.set-cont .tovar[data-pageid="' + id + '"]').remove();
		var cnt = $('.set-cont .tovar').length;
		$('.abs-block .positions a').text(cnt + ' позиций');
		if (cnt < 1) {
			$('.abs-block').addClass('hid');
		}
	}
	if (action == 'add') {
		var cnt = $('.set-cont .tovar').length;
		if (cnt < 1) {
			// нужно добавить текущий товар
			var tov = $('.des-tovar');
			var page_id = tov.data('pageid');
			var name = tov.data('name');
			var link = tov.data('link');
			var type = '';//tov.data('type');
			var price = tov.data('price');
			var old_price = tov.data('old-price');
			var img = tov.find('.des-t-left img:first').attr('src');
			var img_big = tov.find('.des-t-left .slick-slide:first img').attr('src');
			var tovar = $('<div class="tovar" data-pageid="' + page_id + '" data-price="' + price + '" data-old-price="' + old_price + '"><div class="tovar-img tipso tipso_style" rel="' + img_big + '"><a href="' + link + '"><img src="' + img + '" alt=""></a></div>' + type + '</div>');
			tovar.appendTo($('.set-cont'));
		}
		//debugger;
		$('.abs-block').removeClass('hid');
		var src_inp = $('.state-more input[data-pageid="' + id + '"]');
		var name = src_inp.data('name');
		var link = src_inp.data('link');
		var type = src_inp.data('type');
		var price = src_inp.data('price');
		var old_price = src_inp.data('old-price');
		var img = src_inp.parents('.state-in').find('.foto img').attr('src');
		var img_big = src_inp.parents('.state-in').find('.foto').attr('rel');
		var remove_enable =(src_inp.parents('.c_or_1').length > 0) ? false : true;
		var dop =(src_inp.parents('.state-green').length > 0) ? false : true;
		if (dop) {  // доп. товар
			var tovar = $('<div class="tovar dop" data-pageid="' + id + '" data-price="' + price + '" data-old-price="' + old_price + '"><a href="#" class="kpk_delete"></a><div class="tovar-img tipso tipso_style" rel="' + img_big + '"><a href="' + link + '"><img src="' + img + '" alt=""></a></div>' + type + '</div>');
		}else if(remove_enable) { // удаляемый товар в комплекте
			var objid = src_inp.data('objid');
			var tovar = $('<div class="tovar" data-pageid="' + id + '" data-objid="' + objid + '" data-price="' + price + '" data-old-price="' + old_price + '"><a href="#" class="kpk_delete"></a><div class="tovar-img tipso tipso_style" rel="' + img_big + '"><a href="' + link + '"><img src="' + img + '" alt=""></a></div>' + type + '</div>');
		}else{ // не удаляемый товар из комплекта
			var objid = src_inp.data('objid');
			var tovar = $('<div class="tovar" data-pageid="' + id + '" data-objid="' + objid + '" data-price="' + price + '" data-old-price="' + old_price + '"><div class="tovar-img tipso tipso_style" rel="' + img_big + '"><a href="' + link + '"><img src="' + img + '" alt=""></a></div>' + type + '</div>');
		}
		tovar.appendTo($('.set-cont'));
		var cnt = $('.set-cont .tovar').length;
		$('.abs-block .positions a').text(cnt + ' позиций');
		$('.set-cont').show();
		tovarImgTipso();

		tovar.find('.kpk_delete').click(function() {
                    //console.log('kpk_delete click');
                    var id = $(this).parents('.tovar').data('pageid');
                    ChangeNabor(id, 'del');
                    var inp = $('input[data-pageid="' + id + '"]');
                    inp.prop("checked", false).removeAttr('checked');
                    var state = inp.parents('.state-in');
                    state.removeClass('checked');
                    // пересобираем данные по составу комплекта
                    update_composition();
                    return false;
		});
	}
        // пересобираем данные по составу комплекта
        update_composition();
	calc_compl_price();
}

// пересобираем данные по составу комплекта
function update_composition(){
    var sostav = [];
    $('.check input:checked').each(function () {
        sostav.push('<li>');
        sostav.push('<div class="name">');
        sostav.push('<div class="price">');
        sostav.push(numeric_format($(this).parent().parent().data('price'), ' '));
        sostav.push('<span class="rub">руб.</span></div>');
        sostav.push($(this).parent().parent().data('name'));
        sostav.push('</div>');
        sostav.push('<div class="v_korobke">');
        sostav.push($(this).parent().parent().data('v_korobke'));
        sostav.push('</div>');
        sostav.push('</li>');
    });

    if ($('.base_sostav_postavki_info').length > 0) {
        $('.panes .pane:nth-child(2) ul.zebra').html($('.base_sostav_postavki_info').html() + sostav.join(''));
    } else {
        $('.panes .pane:nth-child(2) ul.zebra').html(sostav.join(''));
    }
    $('.sostav_name').text('состав поставки (' + $('.panes .pane:nth-child(2) ul.zebra > li').length + ')');
}

function ChangePar(id, action, group) {
	//console.log('ChangePar', id, action, group);
	if (action == 'del') {
		/*$('.set-cont .tovar[data-pageid="' + id + '"]').remove();
		var cnt = $('.set-cont .tovar').length;
		$('.abs-block .positions a').text(cnt + ' позиций');
		if (cnt < 1) {
			$('.abs-block').addClass('hid');
		}*/
		$('.settings .sett li[data-group="' + group + '"]').remove();
		var cnt = $('.settings .sett li').length;
		if (cnt < 1) {
			$('.settings').addClass('hid');
		}
	}
	if (action == 'add') {
		var cnt = $('.set-cont .tovar').length;
		if (cnt < 1) {
			var tov = $('.des-tovar');
			var page_id = tov.data('pageid');
			var name = tov.data('name');
			var price = tov.data('price');
			var old_price = tov.data('old-price');
			var type = tov.data('type');
			var link = tov.data('link');
			var img = tov.find('.des-t-left img:first').attr('src');
			var img_big = tov.find('.des-t-left img:first').attr('src');
			var tovar = $('<div class="tovar" data-pageid="' + page_id + '" data-price="' + price + '" data-old-price="' + old_price + '"><div class="tovar-img tipso tipso_style" rel="' + img_big + '"><a href="' + link + '"><img src="' + img + '" alt=""></a></div>' + type + '</div>');
			tovar.appendTo($('.set-cont'));
			$('.set-cont').show();
			$('.set-block').removeClass('empty');
			$('.positions span').text(name);
			$('.positions a').text('');
			var price_s = numeric_format(price, ' ');
			$('.abs-block .price').html('<span>стоимость: </span>' + price_s + '<span class="rub">руб.</span>');
			//$('.abs-block .set-block').addClass('empty');
			tovarImgTipso();
		}
		$('.abs-block').removeClass('hid');
		$('.settings').removeClass('hid');
		var src_inp = $('.state-varxar input[data-id="' + id + '"]');
		var name = src_inp.data('name');
		var img = src_inp.parents('.slide').find('.img img').attr('src');
		var par = $('<li class="show_kpk_popup" data-image="' + img + '" data-item="var_' + id + '" data-group="' + group + '"><img src="' + img + '" title="' + name + '" alt="' + name + '"></li>');
		$('.settings .sett li[data-group="' + group + '"]').remove();
		par.appendTo($('.settings .sett'));
	}

	// проверка на кол-во не выбранных параметров
	var cnt = $('#vx .state-c').length;
	$('#vx .state-c').each(function() {
            var group = $(this).attr('rel');
            if ($('.settings .sett li[data-group="' + group + '"]').length > 0) 	{
                cnt--;
            }
	});

	// Если есть невыбранные вариативные параметры
	if (cnt > 0) {
            $('.white-popup .btn').addClass('disabled');
	}else{
            $('.btn.disabled').removeClass('disabled');
            $('.white-popup .btn').click(function() {
                //console.log(id, 'white-popup add to cart');
                if ($(this).hasClass('disabled')) return false;
                var id = (this.rel.indexOf('add_basket') != -1) ? this.rel.replace(/^add_basket_/, '') : this;
                $.magnificPopup.close();
                site.basket.add(id, this);
                return false;
            });
	}
}

function calc_compl_price() {
	var price = 0;
	var old_price = 0;
	var discount = 0;
	$('.set-cont .tovar').each(function() {
            price += $(this).data('price');
            old_price += $(this).data('old-price');
	});
        discount = old_price - price;
	var price_s = numeric_format(price, ' ');
	var old_price_s = numeric_format(old_price, ' ');
	var discount_s = numeric_format(discount, ' ');
	$('.abs-block .price').html('<span>стоимость: </span>' + price_s + '<span class="rub">руб.</span>');
        $('.tov-price.price .price-cur').html(price_s + '<span class="rub">руб.</span>');
        $('.old_price_area .old_price').html(old_price_s + '<span class="rub">руб.</span>');
        $('.old_price_area .discount').html(discount_s + '<span class="rub">руб.</span>');
}

/**
 * Форматирование числа.
 * @author Andrey Mishchenko (http://www.msav.ru/)
 * @param val - Значение для форматирования
 * @param thSep - Разделитель разрядов
 * @param dcSep - Десятичный разделитель
 * @returns string
 */
function numeric_format(val, thSep, dcSep) {

    // Проверка указания разделителя разрядов
    if (!thSep) thSep = ' ';

    // Проверка указания десятичного разделителя
    if (!dcSep) dcSep = ',';

    var res = val.toString();
    var lZero = (val < 0); // Признак отрицательного числа

    // Определение длины форматируемой части
    var fLen = res.lastIndexOf('.'); // До десятичной точки
    fLen = (fLen > -1) ? fLen : res.length;

    // Выделение временного буфера
    var tmpRes = res.substring(fLen);
    var cnt = -1;
    for (var ind = fLen; ind > 0; ind--) {
        // Формируем временный буфер
        cnt++;
        if (((cnt % 3) === 0) && (ind !== fLen) && (!lZero || (ind > 1))) {
            tmpRes = thSep + tmpRes;
        }
        tmpRes = res.charAt(ind - 1) + tmpRes;
    }

    return tmpRes.replace('.', dcSep);

}


function closePops() {
	clearTimeout(interval);
	$('.b-found').hide();
	$('.b-filter-brands__series-btn-bubble').fadeOut(300);
}

function checkFloatPar() {
	var slider_check = true;
	$('input[data-limit]').each(function() {
		var $this = $(this);
		var val = parseFloat(del_spaces($this.val()));
		var name = $this.attr('name');
		var dataname = $this.data('name');
		var limit = parseFloat($this.data('limit'));
		//console.log(name, val, limit);
		//debugger;
		if (name.indexOf('from') > 0 ) {
			var name2 = name.replace(/from/, 'to');
			var obj = $('input[name="' + name2 + '"]');
			var limit2 = parseFloat(obj.data('limit'));
			var limit3 = parseFloat(del_spaces(obj.val()));
			limit2 = (limit3 > limit && limit3 < limit2)? limit3 : limit2;
			if (val < limit) {
				$this.val(limit);
				if (dataname == 'price' && $("#filter-slider").hasClass('ui-slider')) { jQuery("#filter-slider").slider('values', [limit, limit3]); slider_check = false; }
			}
			if (val > limit2) {
				$this.val(limit2);
				if (dataname == 'price' && $("#filter-slider").hasClass('ui-slider')) { jQuery("#filter-slider").slider('values', [limit2, limit3]); slider_check = false; }
			}
		}else{
			var name2 = name.replace(/to/, 'from');
			var obj = $('input[name="' + name2 + '"]');
			var limit2 = parseFloat(obj.data('limit'));
			var limit3 = parseFloat(del_spaces(obj.val()));
			limit2 = (limit3 < limit && limit3 > limit2) ? limit3 : limit2;
			if (val > limit) {
				$this.val(limit);
				if (dataname == 'price' && $("#filter-slider").hasClass('ui-slider')) { jQuery("#filter-slider").slider('values', [limit3, limit]); slider_check = false; }
			}
			if (val < limit2) {
				$this.val(limit2);
				if (dataname == 'price' && $("#filter-slider").hasClass('ui-slider')) { jQuery("#filter-slider").slider('values', [limit3, limit2]); slider_check = false; }
			}
		}
	});
	if (slider_check && $("#filter-slider").hasClass('ui-slider')) jQuery("#filter-slider").slider('values', [parseFloat(del_spaces(jQuery("input#minCost").val())),parseFloat(del_spaces(jQuery("input#maxCost").val()))]);
}

function check_nalichie(obj) {
		checkFloatPar();

		msg = get_params();
		//console.log(msg);

		var offset = (obj) ? obj.offset() : false;
		var base_category_id = $('.search-big').data('base');
		var base_filter = $('.search-big').data('basefilter');
		var top_base_category_id = $('.search-big').data('topbase');
		var top_base_filter = $('.search-big').data('topbasefilter');
		var opened_enums = '';
		$('.search-big ul.acc li:not(.hid) a.active').each(function() {
            var name = $(this).data('fieldname');

            if(name) {
                opened_enums = opened_enums + $(this).data('fieldname') + ',';
            }
		});
		$('.search-big li[data-multiple="0"] a.opener.active').each(function() {
            var name = $(this).data('fieldname');

            if(name) {
                opened_enums = opened_enums + $(this).data('fieldname') + ',';
            }
		});
		$('.b-found').hide();

		closePops();

		if (xhr) xhr.abort();

		xhr = $.ajax({
			//url: '/udata/catalog/getSmartFilters2//0/' + base_category_id + '/1/10//(cenovye_svojstva;1c;har).json',
			url: '/ajax/catalog.filter.php?mode=getNal&base_category_id=' + base_category_id + '&base_filter=' + base_filter + '&top_base_category_id=' + top_base_category_id + '&top_base_filter=' + top_base_filter + '&opened_enums=' + opened_enums,
			data: msg,
			dataType: 'json',
			cache: false,
			success: function (data, status) {

				if (offset) var left = offset.left - $('.b-found').width() - 10;

				//console.log(data);
				//return;
				if (left) $('.b-found').css({'top': offset.top -10 , 'left': left}).show();

				if (data.object_total > 0) 	{
					$('.b-found .b-found__quantity-phrase').text('Найдено ' + data.object_total);
					$('.b-found .b-found__amount').show();
					$('.b-found .b-found__nothing').hide();
					$('.found-num').removeClass('zero');
				}else{
					$('.b-found .b-found__amount').hide();
					$('.b-found .b-found__nothing').show();
					$('.found-num').addClass('zero');
				}

				// Оставить активными только доступные бренды
				$('.check[data-link^="?filter[brand]="]').addClass('filter_checkbox_disabled');
				var index;
				for (index = 0; index < data.allowed_brands.length; ++index) {
					//console.log(data.allowed_brands[index]);
					$('.check[data-link="?filter[brand]=' + data.allowed_brands[index] + '"]').removeClass('filter_checkbox_disabled');
				}
				$('.check[data-link^="?filter[ser]="]').addClass('filter_checkbox_disabled');
				for (index = 0; index < data.allowed_series.length; ++index) {
					//console.log(data.allowed_series[index]);
					$('.check[data-link="?filter[ser]=' + data.allowed_series[index] + '"]').removeClass('filter_checkbox_disabled');
				}

				// Оставить активными только доступные enum
				$('.search-big li[data-multiple="0"] .drop:visible .check[data-enum], .search-big li[data-multiple="1"] .drop .check[data-enum]').addClass('filter_checkbox_disabled');
				var index;
				for (index = 0; index < data.allowed_enums.length; ++index) {
					//console.log(data.allowed_brands[index]);
					$('.check[data-enum="' + data.allowed_enums[index] + '"]').removeClass('filter_checkbox_disabled');
				}

				$('.found-num').text('Найдено ' + data.tovars);

				interval = setTimeout(closePops, 3000);

			},
			error: function (data, status, e) {
				//alert(e);
			}
		});
}

function filter_form_clear(obj) {
	var form = $('.search-big');
	var name = obj.data('name');
	//console.log('clear:', name);

	if (typeof(name) != "undefined") 	{
		//console.log('clear one:', name);
		var inp = form.find('input[name*="[' + name + ']"]');
		if (inp.eq(0).attr('type') == 'text')  {
			inp.val($(this).data('defaultvalue'));
		}else{
			inp.prop('checked', 0);
		}
	}else{
		form.find('select').each(function(element) {
			$(this).prop('selectedIndex', 0);
		});

		form.find('input[type="checkbox"]').each(function(element) {
			$(this).prop('checked', 0);
		});

		form.find('input[type="text"]').each(function() {
			$(this).val($(this).data('defaultvalue'));
		});
	}


}

function get_params() {
	var form = $('.search-big'),
		msg = '',
		sep = '&';

	form.find('select').each(function(element) {
		var sel = $(this);
		//var filter = [];
		//filter.push(this.value);
		//var pars = filter.join(',');
		var vals = sel.find('option:selected');
		var arr = (vals.length > 1) ? '[]' : '';
		vals.each(function() {
			msg = msg  + sep + sel.attr('name') + arr + '=' + this.value;
			sep = '&';
		});
	});

	msg = msg  + sep + form.find('input[type="checkbox"]').serialize();

	//msg = msg  + check_diapazon_params(form, sep, 'distance');
	form.find('input.diapazon[type="text"]').each(function() {
		var fieldname = $(this).data('name');
		//console.log(fieldname);
		msg = msg  + check_diapazon_params(form, sep, fieldname);
	});

	return msg;
}

function check_diapazon_params(form, sep, s) {
	var el = form.find('input[name^="filter[' + s + ']"]');
	var msg = '';

	if (el.length == 2) {

		check_val(el.eq(0));
		check_val(el.eq(1));

		//if (el.eq(0).val() != '' && el.eq(0).val() != el.eq(0).data('defaulvalue')) msg = msg  + sep + el.eq(0).attr('name') + '=' + el.eq(0).val();
		//if (el.eq(1).val() != '' && el.eq(1).val() != el.eq(1).data('defaulvalue')) msg = msg  + sep + el.eq(1).attr('name') + '=' + el.eq(1).val();
		if (el.eq(0).val() != '' && el.eq(1).val() != '' && (del_spaces(el.eq(0).val()) != el.eq(0).data('defaultvalue') || del_spaces(el.eq(1).val()) != el.eq(1).data('defaultvalue'))) {
			msg = msg  + sep + el.eq(0).attr('name') + '=' + del_spaces(el.eq(0).val());
			msg = msg  + sep + el.eq(1).attr('name') + '=' + del_spaces(el.eq(1).val());
		}
	}

	return msg;
}

function check_val(el) {
	//debugger;
	var defaultvalue = parseFloat(el.data('defaultvalue'));
	var limitvalue = parseFloat(el.data('limit'));
	var value = parseFloat(del_spaces(el.val()));
	var name = el.attr('name');
	if (isNaN(value) || value == '')
		el.val(defaultvalue);
	else if(name.indexOf('from') != -1 && value < limitvalue) {
		el.val(limitvalue);
	}else if(name.indexOf('to') != -1 && value > limitvalue) {
		el.val(limitvalue);
	}
}

function get_url() {
    var base_category_id = $('.search-big').data('base');
    var top_base_category_id = $('.search-big').data('topbase');
    var base_filter = $('.search-big').data('basefilter');

    msg = get_params();
    //console.log(msg);

    if (xhr) xhr.abort();

    xhr = $.ajax({
        url: '/ajax/catalog.teleport.php?base_category_id=' + base_category_id + '&base_filter=' + base_filter + '&top_base_category_id=' + top_base_category_id,
        data: msg,
        dataType: 'json',
        cache: false,
        success: function (data, status) {
            //console.log(data);
            link = data.link;
            msg = (data.msg) ? '?' + data.msg + '&is_filtered=1' : '';
            //console.log(link, msg);
            //return;

            window.location.href = link + msg;
        },
        error: function (data, status, e) {
            //alert(e);
        }
    });
}

function catalogEqualHeights() {
    $('.tov.object:not(.eh) .btm-price-block').each(function() {
        var h = $(this).height();
        //$(this).parents('div.tov.object').css('padding-bottom', h).end().css({'position':'absolute', 'bottom': '18px'});
        var div = $('<div></div>').css({'height': h});
        div.insertBefore($(this));
        $(this).css({'position':'absolute', 'bottom': '18px'});
    });
    $('.tov.object:not(.eh)').equalHeights();
    $('.tov.object:not(.eh)').addClass('eh');
    //$('.tov-slider div.tov.object').equalHeights();
}

    function fn_loadmore(obj) {
        var nextpage = $(".pagenavi:first span.current").eq(0).next();

        //console.log(nextpage.attr('href'));
        if (nextpage) {
            $('.show-more-btn').hide();
            $(obj).addClass('preload').append($('<div id="" class="preloader"><span class="loader"></span></div>'));

            $.ajax({
                url: nextpage.attr('href'),
                dataType: 'html',
                success: function(data, status){
                    var html = $(data).find('.objects').eq(0).html();
                    //console.log(html);
                    var s = nextpage.text();
                    if (nextpage.next().hasClass('space')) 	{
                        var s_end = parseInt(nextpage.next().next().text());
                        if (parseInt(s) < s_end - 1) 	{
                            $('<a href="?p=' + (parseInt(s)) + '">' + (parseInt(s) + 1) + '</a>').insertBefore(nextpage);
                        }else{
                            $('<span class="clicked">' + s + '</span>').insertBefore(nextpage);
                        }
                    }else{
                        $('<span class="clicked">' + s + '</span>').insertBefore(nextpage);
                    }
                    nextpage.remove();
                    var ddt = $(obj).attr('data-rel');
                    var ddp = $(obj).attr('data-name');
                    var ddo = ddt - ddp * parseInt(s); ddo = (ddo > 0) ? ddo : 0;
                    var ddpo = (ddp < ddo) ?  ddp : ddo;
                    $('.post_here').text(ddt - ddo);
                    $('.show-more-btn').html('Показать ещё ' + ddpo + ' <span class="itemsleft">из ' + ddo + '</span>').show();
                    $(obj).removeClass('preload'); $('.preloader').remove();
                    $('.pagenavi').html($(data).find(".pagenavi").html());
                    $('.objects').append(html);

                    if (!$(data).find(".pagenavi:first span.current").eq(0).next().is('a')) {
                            $(".view20").hide();
                    }
                    //initbtn();
                    site.basket.init();
                    //showPhoto();
                    catalogEqualHeights();
                }
            });
        }else{
            $(".view20").hide();
        }
    }

// При нажатии кнопки регистрации в popup, предварительная валидация уже прошла
function popup_validation(form_id) {
	var check = validation(form_id);

	if (check) {
		check = false;
		var url = "/udata/users/ajax_reg_check.json?phone=" + '(' + $('#poplogin input.code').val() + ')' + $('#poplogin input.tel').val() + '&fname=' + $('#poplogin .auth_reg input[name="fname"]').val() + '&email=' + $('#poplogin .auth_reg input[name="email"]').val();
		jQuery.ajax({
			url : url,
			cache : false,
			async: false,
			timeout: 10000,
			dataType : 'json',
			success : function(data) {
				var msg = data.msg;
				//console.log(1);
				//debugger;
				if (msg == 'ok') {
					$('#poplogin input[name="login"]').val('popup');
					check = true;
				}else{
					for(var i in data.error) {
						$('#poplogin input[name="' + data.error[i][0] + '"]').parents('.box-field').addClass('error-field').find('.text-error').text(data.error[i][1]);
					}
				}
			}
		});

	}
	//console.log(2);
	return check;
}


// validaion

//функция принимает id формы в формате #id
//ВОЗМОЖНОСТИ
//-проверка обязательности поля по class="required"
//-проверка обязательных checkbox-ов по class="rcheckbox"
//-проверка email регуляркой class="email"
//-проверка поля на мах / мин значение по аттрибутам maxval / minval
//-ajax проверка капчи по классу class="captcha"
//-проверка совпадения паролей по name="password" и name="password_confirm"
//------//
//В ПЕРСПЕКТИВЕ
//-проверка на ввод числа
//-на ввод руских слов
//-проверка даты
//-вынести вывод ошибок в отдельную функцию с разделением по выводу(общее/для каждого поля и т.д.)(как вариант прикрепить tooltip)
//-инициализация как плагина
//-прикрепить css, для отображения стилей

function close_err_msg(obj) {
	obj.parent().remove();
}

$('.box-field input[type="text"].required').keyup(function() {
	var div = $(this).parents('.box-field');
	if($(this).val().length < 2 || $(this).val() == $(this).attr('placeholder')){
		div.addClass('error-field').removeClass('valid-field');
	}else{
		div.removeClass('error-field').addClass('valid-field');
		div.find('.icon-valid').show();
	}

});

function ShowHidePassword(obj) {
	if ($(obj).hasClass('eye')) {
		$(obj).removeClass('eye'); $('input.password').attr('type', 'password');
	}else{
		$(obj).addClass('eye');  $('input[type="password"]').addClass('password').attr('type', 'text');
	}
}

function validation(form_id){
    var messages_capcha = "Неверно указан код с картинки.";
    var messages_text = "Поле обязательно для заполнения.";
    var messages_email = "Поле E-mail заполнено неверно.";
    var messages_max = "Сумма превышает лимит.";
    var messages_min = "Сумма меньше допустимого лимита.";
    var messages_min_length = "Неверный формат номера.";

    var isSpecialMode = $(form_id).hasClass("oneClickForm"); //mode for satra.ru oneClick order

    $("span.error").remove();
    $("input.error").removeClass('error');
    $(".box-field").removeClass('error-field');
    $("textarea.error").removeClass('error');

    //debugger;
    var err_arr = new Array(messages_capcha, messages_text, messages_email, messages_max, messages_min);

    var $this = $(form_id), valid = true;
    $this.find('input[type="text"].required,input[type="tel"].required').each(function(){
        var object = $(this);
        //console.log($(this).val(), $(this).attr('name'), $(this).val().length, $(this).attr('placeholder'));
        if($(this).val().length < 2 || $(this).val() == $(this).attr('placeholder')){
            $(this).addClass('error').parents('.box-field').addClass('error-field');
            if ($(this).data('scroll') == 1) $('body,html').animate({scrollTop: 200 },800);
            var lab = $(this).parents('.form-row').find('label');
            var inp_div = $(this).parents('.form-row').find('.form-el');
            //var position = inp_div.position();
            //var l = (position) ? position.left : 0;
            //var w = inp_div.width();
            messages_text_s = ($(this).data('msg-error')) ? $(this).data('msg-error') : messages_text;
            if(!lab.prev().hasClass('error') && $(this).parents('.box-field').length == 0){
                $(this).before('<span class="error">'+messages_text_s+'<a href="#" class="close"></a></label>');
                $('span.error .close').click(function () {close_err_msg($(this)); return false;});
            }
            var div = $(this).parents('.box-field');
            if (div) $(this).removeClass('valid-field');
            valid = false;return;
        }else if($.inArray(object.val(), err_arr) != -1){
            valid = false;
            return;
        }

        /*mode for satra.ru oneClick order check empty city*/
        val = $(this).val();
        if(val.search(/[a-zA-Zа-яА-Я0-9]/) == -1){
            $(this).addClass('error');
            if(!$(this).next().hasClass('error_msg')){
                //$(this).parent().after('<label class="error_msg">'+messages_text+'</label>');
            }
            valid = false;
            return;
        }
        /*--*/
    });

    $this.find('input[type="tel"].required').each(function(){
        console.log($(this).val(), $(this).attr('name'), $(this).val().length, $(this).attr('placeholder'));
        if ($(this).hasClass('complete') || $(this).val().indexOf('_') < 0) 	{
        }else{
            $(this).addClass('error').parents('.box-field').addClass('error-field');
            if ($(this).data('scroll') == 1) $('body,html').animate({scrollTop: 200 },800);
            valid = false;return;
        }
    });

    $this.find('.email2').each(function(){
        if($(this).is('.error')){

        }else{
            if(!isValidEmail($(this).val())){
                if(!$(this).next().hasClass('error_msg')){
                    //$(this).addClass('error').parent().after('<label class="error_msg">'+messages_email+'</label>');
                }
                valid = false;
            }
        }
    });

    //проверка на макс значение
    $this.find('input[maxval]').each(function(){
        var maxval = parseInt($(this).attr('maxval'));
        var myval = $(this).val();
        if(myval > maxval){
            if(!$(this).next().hasClass('error_msg')){
                //$(this).addClass('error').parent().after('<label class="error_msg">'+messages_max+'</label>');
            }
            valid = false;
        }
    });

    //проверка на макс значение
    $this.find('input[minval]').each(function(){
        var minval = parseInt($(this).attr('minval'));
        var myval = $(this).val();
		//console.log('minval', myval, minval, myval < minval);
        if(myval < minval){
            $(this).addClass('error').parents('.box-field').addClass('error-field');

			var div = $(this).parents('.box-field');
			if (div) $(this).removeClass('valid-field');

            if(!$(this).next().hasClass('error_msg')){
                //$(this).parent().after('<label class="error_msg">'+messages_min+'</label>');
            }
            valid = false;
        }
    });

    //проверка на макс значение
    $this.find('input[minlength]').each(function(){
        if(!$(this).is('.error')){
			var minval = parseInt($(this).attr('minlength'));
			var myval = $(this).val();
			if(myval < minval){
				$(this).addClass('error');
				if(!$(this).next().hasClass('error_msg')){
					//$(this).parent().after('<label class="error_msg">'+messages_min_length+'</label>');
				}
				valid = false;
			}
		}
    });

    //проверка капчи
    $this.find('.captcha2').each(function(){
        if(!$(this).is('.error')){

            //valid = false;
            var input = $(this);
            var value = input.val();

            $.ajax({
                url: "/templates/default/js/handlers/check_captcha.php?captcha="+value,
                async:false,
                success: function(data){
                    if(data == "false"){
                        input.addClass('error');
                        if(!input.next().hasClass('error_msg')){
                           //input.parent().after('<label class="error_msg">'+messages_capcha+'</label>');
                        }
                        valid = false;
                    }
                }
            });
        }
    });

    //проверка совпадения паролей
    $this.find("input[name='password']").each(function(){
        if($this.find("input").attr('name')=='password_confirm'){
            if($(this).val()!=$this.find("input[name='password_confirm']").val()){
                if(!$this.find("input[name='password_confirm']").next().hasClass('error_msg')){
                    $this.find("input[name='password_confirm']").parent().after('<label class="error_msg">Пароли не совпадают</label>');
                }
                $(this).addClass('error');
                $this.find("input[name='password_confirm']").addClass('error');
                valid = false;
            }
        }
    });

    //обязательный checkbox
    $this.find('.rcheckbox').each(function(){
        if(!$(this).is(':checked')){
            $(this).addClass('error');
            if(!$(this).next().hasClass('error_msg')){
                $(this).parent().after('<label class="error_msg">Обязательное условие</label>');
            }
            valid = false;
        }
    });
    /*
    if(!valid){
        setTimeout(function(){
            $this.find('.error').each(function(){
                //если не четбох очищаем поле
                if(!$(this).is('.rcheckbox')){
                    $(this).val('');
                }
                $(this).removeClass('error');
                $this.find('.error_msg').remove();
            });
        }, 2000);

        //return false;

    }
       */
/*
    if(!valid) {
        var previous = $this.find('.error');
        //previous = previous.removeClass('error');

        previous.addClass('error');
        previous.fadeOut();
        previous.fadeIn();
        previous.fadeOut();
        previous.fadeIn();

        setTimeout(function(){
            //previous = previous.replace('-error','');
            previous.removeClass('error');
        },2000);
    }*/
	//console.log(valid);
    return valid;
}


function isValidDate(input) {
    var pattern = new RegExp(/^[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9][0-9][0-9]$/);
    return pattern.test(input.val());
}
function isValidEmail(email){
    email = email.replace(/^\s+|\s+$/g, '');
    return (/^([a-z0-9_\-]+\.)*[a-z0-9_\-]+@([a-z0-9][a-z0-9\-]*[a-z0-9]\.)+[a-z]{2,4}$/i).test(email);
}

/* default_value.js */
function cleardefValues(target_form){
    $('#'+target_form + ' input:text,' + '#'+target_form + ' textarea').each(function() {
        var def = $(this).attr('def');
        if(def == $(this).val()){
            $(this).val('');
        }
    });
}

function returndefValues(target_form){
    $(target_form + ' input:text,' + target_form + ' textarea').each(function() {
        if($(this).val() == '') {
            $(this).val($(this).attr('value'));
        }
    });
}

$(document).ready(function() {
    $(".version").each(function() {
       var Id = $(this).get(0).id;
       var maintbheight = 'auto';
       var maintbwidth = 848;
       $("#" + Id + " .FixedTables").fixedTable({
           width: maintbwidth,
           height: maintbheight,
           fixedColumns: 1,
           // header style
           classHeader: "fixedHead",
           // footer style
           classFooter: "fixedFoot",
           // fixed column on the left
           classColumn: "fixedColumn",
           // the width of fixed column on the left
           fixedColumnWidth: 270,
           // table's parent div's id
           outerId: Id
       });
   });
});


var _, i;

//Yandex map
var myMap, myMap2;

if ($('#checkout').length > 0) {
    ymaps.ready(function() {
        myMap = new ymaps.Map('map', {
            center: [55.619281, 37.483735],
            zoom: 16,
            controls: []
        },{
            suppressMapOpenBlock: true
        }, {
            searchControlProvider: 'yandex#search'
        }),
        myMap2 = new ymaps.Map('map2', {
            center: [55.613283, 37.487661],
            zoom: 16,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        }),
        collectionPlacemark = new ymaps.GeoObjectCollection(),
        // Создаем геообъект с типом геометрии "Точка".
        myGeoObject = new ymaps.GeoObject({
            // Описание геометрии.
            geometry: {
                type: "Point",
                coordinates: [55.619281, 37.483735]
            },
        }, {
            // Опции.
            // Иконка метки будет растягиваться под размер ее содержимого.
            preset: 'islands#blackStretchyIcon',
            // Метку можно перемещать.
            draggable: false
        });

        // Создаем геообъект с типом геометрии "Точка".
        myGeoObject2 = new ymaps.GeoObject({
            // Описание геометрии.
            geometry: {
                type: "Point",
                coordinates: [55.613283, 37.487661]
            },
        }, {
            // Опции.
            // Иконка метки будет растягиваться под размер ее содержимого.
            preset: 'islands#blackStretchyIcon',
            // Метку можно перемещать.
            draggable: false
        });

        myMap.geoObjects.add(myGeoObject)
            .add(new ymaps.Placemark([55.619281, 37.483735], {
                balloonContent: '41 км МКАД ТК Славянский мир Стр. А27/1'
            }, {
                preset: 'islands#dotIcon',
                iconColor: '#e30613'
            }));

        myMap2.geoObjects.add(myGeoObject2)
            .add(new ymaps.Placemark([55.613283, 37.487661], {
                balloonContent: '41 км МКАД ТК Славянский мир Стр. Б19/1'
            }, {
                preset: 'islands#dotIcon',
                iconColor: '#e30613'
            }));

        myMap.events.add('click', function (e) {
            clickDeliveryMap(e);
        });

        /*  functions */

        /**
         * Создания балуна на карте
         * @param coords координаты
         */
        function createPlacemark (coords, draggable) {
            var iconContent = {
                iconContent: ''
            }, option = {
                draggable: draggable
            };

            if(draggable){
                option = jQuery.extend( option, {
                        preset: 'islands#violetStretchyIcon'
                });
            }else{
                option = jQuery.extend( option, {
                    iconLayout: 'default#image',
                    //iconImageHref: '/bitrix/images/big-marker-red.png',
                    iconImageSize: [41 / 1.3, 49 / 1.3]
                });
            }
            return new ymaps.Placemark(coords, iconContent, option);
        }

        /**
         * Получить по координатам адресс
         * @param coords координаты
         */
        function setAddressOfCoords(coords) {
            //Запрос на получение адресса по координатам
            ymaps.geocode(coords).then(function (res)
            {
                firstGeoObject = res.geoObjects.get(0);

                //Подставим адресс
                setAddress(firstGeoObject.properties.get('text'));
            });
        }

        /**
         * Вставим адресс в инпут
         * @param address адресс
         */
        function setAddress(address) {
            if (!address){
                return;
            }

            $('input[name="data[new][adress]"]').val(address);
            //hideDelivery();
        }

        /**
         * Установка данные в балун
         * @param firstGeoObject данные
         * @elem точка к которой будут привязаны данные
         */
        function setPointProperties(firstGeoObject, elem) {
            elem.properties.set({
                balloonContent: firstGeoObject.properties.get('text'),
                balloonContentHeader: firstGeoObject.properties.get('name'),
                balloonContentBody: firstGeoObject.properties.get('text'),
                hintContent: firstGeoObject.properties.get('text')
            });
        }

        /**
         * Обработка клика по карте ставим точку на карте, подставляем адресс в инпут
         */
        function clickDeliveryMap(e) {
            coords = e.get('coords');
            placeMark = createPlacemark(coords, true);

            collectionPlacemark.removeAll();
            collectionPlacemark.add(placeMark);

            myMap.geoObjects.add(collectionPlacemark);

            // Слушаем событие окончания перетаскивания на метке.
            placeMark.events.add('dragend', function () {
                setAddressOfCoords(placeMark.geometry.getCoordinates());
            });
            setAddressOfCoords(coords);
            //enableDelivery();
        }

        $('input[name*="adress"]').suggestYa({
            countryLimit: 'Россия',
            countResult: 6
        });

        //show map
        $(".show-map__link").click(function () {
            var map_box = $(this).parent().find('.box-map-delivery');
            if (map_box.hasClass('suggest')) {
                map_box.slideDown();
                map_box.removeClass('suggest');
            } else {
                map_box.slideToggle();
            }

            //if (!$('.box-map-delivery').hasClass('init')) {
            //$('.contacts__map').addClass('active').css('z-index', 1);
            if ($(this).hasClass('self')) {
                //console.log('self');
                //myMap.setCenter([54.883421, 37.234162]);
                myMap2.setZoom(15);
//                myMap2.panTo([55.619281, 37.483735], {flying: false, duration: 2000});
                myMap2.panTo([55.613283, 37.487661], {flying: false, duration: 2000});
                //myMap.setZoom(15, {duration: 400})
            } else {
                //myMap.setZoom(15);
                //myMap.panTo([55.619281, 37.483735], {flying: false, duration: 400});
                collectionPlacemark.removeAll();

                //console.log($('#suggest').val());
                var adress = $('input[name="data[new][adress]"]').val();
                var myGeocoder = ymaps.geocode(adress, {results: 1});
                myGeocoder.then(
                        function (res) {
                            //console.log(res.geoObjects);
                            var firstGeoObject = res.geoObjects.get(0);
                            //myMap.geoObjects.add(res.geoObjects);
                            //console('Координаты объекта :' +firstGeoObject.geometry.getCoordinates());
                            //console.log(firstGeoObject);

                            //На карте не найдена
                            if (!firstGeoObject) {
                                return;
                            }
                            //console.log(1, firstGeoObject.geometry.getCoordinates());
                            //console.log(2, firstGeoObject.geometry._coordinates);
                            var coordinate = firstGeoObject.geometry._coordinates;

                            draggable = true;
                            var elem = createPlacemark(coordinate, draggable);
                            /*var elem = new ymaps.Placemark(coordinate, {
                             //balloonContent: '41 км МКАД ТК Славянский мир Стр. А27/1'
                             }, {
                             preset: 'islands#dotIcon',
                             iconColor: '#e30613'
                             });*/
                            collectionPlacemark.add(elem);
                            //console.log(3, elem);

                            //Добавим данные баллуна
                            myMap.geoObjects.add(collectionPlacemark);
                            myMap.setBounds(collectionPlacemark.getBounds(), {
                                checkZoomRange: true
                            }).then(function () {
                                if (myMap.getZoom() >= 18) {
                                    myMap.setZoom(16);
                                }
                            });

                            if (draggable) {
                                elem.events.add('dragend', function () {
                                    setAddressOfCoords(elem.geometry.getCoordinates());
                                });
                            } else {
                                myMap.setPointProperties(firstGeoObject, elem);
                            }


                        },
                        function (err) {
                            // обработка ошибки
                        }
                );
            }

            $('.box-map-delivery').addClass('init');
            //}

            return false;
        });
    });
}

$.fn.setCursorPosition = function(pos) {
    this.each(function(index, elem) {
    if (elem.setSelectionRange) {
        elem.setSelectionRange(pos, pos);
    } else if (elem.createTextRange) {
        var range = elem.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
    });
    return this;
};

// Функция удаления пробелов
function del_spaces(str){
    str = str.toString().replace(/\s+/g,'');
    return str;
}

$(document).ready(function() {
    $(".banner_iphone_1").click(function(event) {
        event.preventDefault();
        var delay = 150;
        $(this).animate({right:'-92px'},delay, function(){
            $('.banner_iphone_2').animate({right:'0px'},delay);
        });
    });
    $(".banner_iphone_2").click(function(event) {
        event.preventDefault();
        var delay = 150;
        $(this).animate({right:'-337px'},delay, function(){
            $('.banner_iphone_1').animate({right:'0px'},delay);
        });
    });
});


//$(document).ready(function() {
//    if($('.text_movable').length > 0){
//        var parent = $('.text_movable').parent();
//        var elem = $('.text_movable').detach();
//        elem.removeClass('before_move');
//        elem.appendTo(parent);
//    }
//});

$(document).ready(function() {
    if($('.textinputs.search.s-txt').length > 0){
        $('.textinputs.search.s-txt').change(check_active_search_string);
        $('.textinputs.search.s-txt').keydown(check_active_search_string);
        $('.textinputs.search.s-txt').keyup(check_active_search_string);
        $('.textinputs.search.s-txt').mouseup(check_active_search_string);
    }
});

$(document).ready(function() {
    if($('ul.cat-list > li > a').length > 0){
        $('ul.cat-list > li > a,ul.cat-list > li > span').click(function(event){
            if($(this).parent().find('ul').length > 0){
                event.preventDefault();
                $(this).closest('ul').find('ul.cat-sub-list').stop(true, true).slideUp(500);
                if($(this).parent().hasClass('active')){
                    // просто сворачиваем активный элемент
                    $(this).closest('ul').find('li').removeClass('active');
                }else{
                    $(this).parent().find('ul').stop(true, true).slideDown(500);
                    $(this).closest('ul').find('li').removeClass('active');
                    $(this).parent().addClass('active');
                    var _this = $(this).parent().find('a');
//                    setTimeout(function(){
//                        $('html, body').animate({
//                            scrollTop: _this.offset().top
//                        }, 500);
//                    }, 600);
                }
            }
        });
    }
});

$(document).ready(function() {
    if($('.item_on_main').length > 0){
        $('.item_on_main').hover(function(){
            $(this).find('.item_on_main_img').stop(true, true).animate({top:'105px'},200);
        },function(){
            $(this).find('.item_on_main_img').stop(true, true).animate({top:'110px'},200);
        });
    }
});

function check_active_search_string(){
    if($('.textinputs.search.s-txt').val() == ''){
        $('.textinputs.search.s-txt').parent().removeClass('not_empty');
    }else{
        $('.textinputs.search.s-txt').parent().addClass('not_empty');
    }
}

// разворачиваем спрятанный фильтр
$(document).ready(function() {
    if($('.show_collapsed_filter').length > 0){
        $('.show_collapsed_filter a').click(function(event){
            event.preventDefault();
            $(this).parent().hide(250);
            // определяем реальную высоту
            elem = $('.rel.rel_collapsed').clone().css({"height":"auto"}).appendTo("body");
            height = elem.css("height"),
            elem.remove();

            $('.rel.rel_collapsed').animate({'height' : height}, 500, function(){
                $('.rel.rel_collapsed').removeClass('rel_collapsed').css('height', 'auto');
            });
        });
    }
});


$(document).ready(function() {
    if($('div.tov.object').length > 0){
        $('div.tov.object').click(function(event){
            event.preventDefault();
            document.location.href = $(this).data('href');
        });
    }
});

$(document).ready(function() {
    if($('.show_more_in_komplekt_full').length > 0){
        $('.show_more_in_komplekt_full').click(function(event){
            event.preventDefault();
            var items = $(this).parent().find('.state-in.big.hid');
            var count = $(this).data('more');
            var i;
            for(i=0; i<items.length; i++){
                if(i == count){
                    break;
                }
                $(items[i]).removeClass('hid');
            }
            if(i >= items.length){
                $(this).hide();
            }

            $('.show_more_in_komplekt_full_total_count').html(items.length - count);
            $('.show_more_in_komplekt_more_position_count').html(items.length - count > count ? count : items.length - count);
        });
    }
});

$(document).ready(function() {
    if($('.like_area').length > 0){
        $('.like_area').hover(function(){
            var elem = $(this).find('.floating_like');
            var cur_width = elem.width();
            var auto_width = elem.css('width', 'auto').width();
            elem.width(cur_width);
            elem.stop(true, false).animate({width: auto_width + "px", opacity: 1}, 300);
        },function(){
            $(this).find('.floating_like').stop(true, false).animate({width: "0px", opacity: 0}, 300);
        });
    }
});
$(document).ready(function() {
    if($('.print_like_area .print').length > 0){
        $('.print_like_area .print').click(function(){
            window.print();
        });
    }
});

$(document).ready(function() {
    if($('.personal_confirm_required').length > 0){
        $('.personal_confirm_required').closest('form').submit(function(){
            $(this).find("input.personal_confirm_required").closest('.personal_confirm_area').removeClass('error');
            if($(this).find("input.personal_confirm_required:checked").length === 0){
                $(this).find("input.personal_confirm_required").closest('.personal_confirm_area').addClass('error');
                return false;
            }
            return true;
        });
    }
});

$(document).ready(function() {
    if($('#filters_place').length > 0){
        $('#filters_place').append( $('.search-big') );
    }
});

$(document).ready(function() {
    if($('#feedback_form_popup_area').length > 0){
        $('#feedback_form_popup_area').load('/udata/webforms/add/671?transform=modules/webforms/ajax_add.xsl', function(){
            $('#feedback_form_popup_area form#popup_form').submit(function(event){
                event.preventDefault();
                if(validation('#feedback_form_popup_area form#popup_form') === false){
                    site.forms.data.save(this);
                    return false;
                }
                $.post($(this).prop('action'), $(this).serialize(), function( data ) {
                    $('#feedback_form_popup_area').html('<div class="popup_result">' + $(data).find('udata').text() + '</div>');
                });
            });
        });
    }
});

 $(document).ready(function(){
    $(".catalog_drop_promo").click(function(event){
        event.preventDefault();
        $("#catalog_menu_promo").toggle();
        return false;
    });
});