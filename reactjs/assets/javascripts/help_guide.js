
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
		$(this).prev().toggleClass("height-2nd");
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
	function sortlist()
	{
	    var cl = document.getElementById('carlist');
	    var clTexts = new Array();
	
	    for(i = 2; i < cl.length; i++)
	    {
	        clTexts[i-2] =
	            cl.options[i].text.toUpperCase() + "," +
	            cl.options[i].text + "," +
	            cl.options[i].value;
	    }
	
	    clTexts.sort();
	
	    for(i = 2; i < cl.length; i++)
	    {
	        var parts = clTexts[i-2].split(',');
	        
	        cl.options[i].text = parts[1];
	        cl.options[i].value = parts[2];
	    }
	}
	
	sortlist();
});
