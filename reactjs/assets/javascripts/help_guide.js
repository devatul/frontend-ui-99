
$(document).ready(function(){
	$("p.on_off").click(function() {
		$(this).toggleClass("on_off_b");
	});
	/*$("p.on_off_click").click(function() {
		$(this).toggleClass("on_off");
	});*/
	$("li.pro_header_li>div.profile_header_submit").click(function(){
		$("li.pro_ul_header_li>ul.pro_ul_header").toggleClass("pro_ul_header_b");
	});
	$("div.ios-switch").click(function(){
		$("div.my-profile-check-none").toggleClass("my-profile-check");
	});
	$("div.off").click(function(){
		$(this).toggleClass("on");
	});
	$("div.btn_edit").click(function(){
		$(this).toggleClass("btn_edit_b");
	});
	$("input.my-note-input").click(function(){
		$(this).next().toggleClass("checkbox-inline_b");
	});
	$(".abc").click(function(){
		$(this).parent().next().toggleClass("my-team-p-b");
	});
	$("a.more").click(function(){ 
		$(".doc-path").toggleClass("height-2nd");
		$(this).children(".more1").toggleClass("display-none");
		$(this).children(".zoom-out").toggleClass("zoom-out-block");
	});
	$("tr.opa>td.opa-child select").click(function(){
		$(this).closest('tbody').find('tr').addClass('opacitys');
		$(this).closest('tr').removeClass('opacitys').addClass('active');
	});
	$("tr.opa>td>div.opa-child").click(function(){
		$(this).closest('tbody').find('tr').addClass('opacitys');
		$(this).closest('tr').removeClass('opacitys').addClass('active');
	});
	
	$(document).mouseup(function (e)
	{
		var container = $(".document_review_table tbody tr.active");

		if (!container.is(e.target) // if the target of the click isn't the container...
			&& container.has(e.target).length === 0) // ... nor a descendant of the container
		{
			
			container.removeClass('active').closest('tbody').find('tr').removeClass('opacitys');
		}
	});
	$( ".my-doc-path" ).each(function( index ) {
		  var hi = "38"; 
		var h = $(this).height();
		if(h>hi){
			$(this).css('height', hi);
			$(this).next().addClass("display-block");
			console.log(h);
			console.log(hi);
		}
		
		});
	$(".more-click").click(function(){
		$(this).next().toggleClass("more-click-bottom-block");
	});
});
