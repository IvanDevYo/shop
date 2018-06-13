$(function() {
var interval;
	$(".catalog__menu-item").mouseover(function() {
		var th = $(this).find(".hover_popup"),
			l = $(th).children(".catalog__menu-item_hover").length;
		if (l >= 4) {
			$(th).css('width', '882px');
		} else if(l > 2) {
			$(th).css('width', '667px');
		} else if(l > 1) {
			$(th).css('width', '452px');
		}
		$(th).css('display', 'flex');
	});

	$(".catalog__menu-item").mouseleave(function() {
		$(".hover_popup").hide();
	});

	$(".mobile__menu-link").click(function(e) {
		e.preventDefault();
		$(".top__nav-nav").toggleClass("opened");
	});

	$(".filter__params-link").click(function(e) {
		e.preventDefault();
		$(this).next(".filter__params-open").toggleClass("vis");
	});

	$(document).on("load", function() {
		$(".scroll").mCustomScrollbar({
	        axis:"y",
	        scrollButtons:{enable:false},
	        advanced:{autoExpandHorizontalScroll:true},
	        scrollInertia: 800
	    });
	});

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
	$('.price-range a').click(function(e) {
		e.preventDefault();
		var obj = $(this);
		$('#minCost').val(obj.data('min'));
		$('#maxCost').val(obj.data('max'));
		jQuery("#filter-slider").slider('values', [obj.data('min'), obj.data('max')]);
		check_nalichie(obj);
		//check_nalichie($('#filter-slider'));
		return false;
	});
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
};

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
};
function del_spaces(str){
    str = str.toString().replace(/\s+/g,'');
    return str;
};

function closePops() {
	clearTimeout(interval);
	$('.b-found').hide();
	$('.b-filter-brands__series-btn-bubble').fadeOut(300);
}

});
