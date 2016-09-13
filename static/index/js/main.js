$(function(){

	var key = 'local';

	var $underline = $('#underline');

	var $inputLine = $('#input-line');

	var $tabBar = $('#tab-bar').on('click', '.tab', function(){

		var n = $(this).index();

		$underline.stop().animate({
			left : n * 127
		}, 100);

		key = $(this).attr('key');

		// if(key == 'local'){
		// 	$inputLine.removeClass('hide-advance');
		// }else{
		// 	$inputLine.addClass('hide-advance');
		// }

	});

	var $searchButton = $('#search-button').click(function(){
		doSearch();
	});

	var $inputKeywords = $('#input-keywords').keyup(function(e){
		if(e.keyCode == 13){
			doSearch();
		}
	});

	function doSearch(){
		var kw = $inputKeywords.val();
		if(kw.length <= 0){
			return;
		}
		G.go(G.url('index', key, {
			keywords : kw
		}), true);
	}


});