$(function() {

	$(".catalog__menu-item").mouseover(function() {
		var th = $(this).find(".catalog__menu_hover");
		$(th).css('display', 'block');
	});

	$(".catalog__menu-item").mouseleave(function() {
		$(".catalog__menu_hover").hide();
	});

});
