$(function(){

	$('#sort-line').bindOptionPart({
		varname : 'order'
	});

	$('#sort-select').bindOptionPart({
		varname : 'order'
	});

	$('#filenum-type').bindOptionDrag({
		varname : 'filenumType'
	});

	$('#filenum-year').bindOptionDrag({
		varname : 'filenumYear'
	});

	$('#menucat').bindOptionDrag({
		varname : 'menucat'
	});

	$('#themecat').bindOptionDrag({
		varname : 'themecat'
	});

	$('#subcat').bindOptionDrag({
		varname : 'subcat'
	});
	$('#position-select').bindOptionPart({
		varname : 'position'
	});

	var $iptInclude = $('#input-kw-include').val(G.request['keywords'] || '');
	var $iptExclude = $('#input-kw-exclude').val(G.request['keywords_not' || '']);

	$('#advance-search-button-show').mousedown(function(){
		window.advance = true;
		$('.advance-search').slideDown();
		$('.normal-search').slideUp();
		return false;
	});
	$('#advance-search-button-fold').mousedown(function(){
		window.advance = false;
		$('.advance-search').slideUp();
		$('.normal-search').slideDown();
		return false;
	});
	if("advance" in G.request){
		$('#advance-search-button-show').mousedown();
	}


	$('#advance-search-go').click(function(){
		var i;
		var toCheck = [
			'order', 'position', 'time_from', 'time_to', 
			'menucat', 'themecat', 'subcat',
			'filenumType', 'filenumYear'];
		var args = {
			keywords     : $iptInclude.val(),
			keywords_not : $iptExclude.val(),
			advance      : 'true',
		};
		for(i = 0; i < toCheck.length; i ++){
			if(toCheck[i] in window.options){
				args[toCheck[i]] = window.options[toCheck[i]];
			}
		}
		if($('#filenum-num').val().length){
			args['filenumNum'] = $('#filenum-num').val();
		}
		G.go(G.url('index', 'local', args));
	});

	var $timeFrom = $('#time-from').asTimeSelect({
		varname : 'time_from'
	});
	var $timeTo   = $('#time-to').asTimeSelect({
		varname : 'time_to'
	});

	$('#filenum-num').val(G.request['filenumNum'] || '');

	(function(o){
		var m = {};
		var i;
		for(i in o){
			if(i != 'c' && i != 'a'){
				m[i] = o[i];
			}
		}
		if(!("keywords" in m) || m.keywords.length < 1){
			$('#list-body').empty();
			return;
		}
		G.call('search.file', m, function(c, d){
			$('#page-list').refreshPage({
				cur : G.request['page'] || 1,
				max : d.page_total
			});
			$('#list-body').refreshList({
				list : d.list
			});
		}, function(c, m){
			alert(m);
		});
	})(G.request);

});