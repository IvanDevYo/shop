$(function() {

	$(".catalog__menu-item").mouseover(function() {
		var th = $(this).find(".catalog__menu_hover"),
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
		$(".catalog__menu_hover").hide();
	});

	$(".mobile__menu-link").click(function(e) {
		e.preventDefault();
		$(".top__nav-nav").toggleClass("opened");
	});

});
