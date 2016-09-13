$(function(){

	$('#sort-line').bindOptionPart({
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

	var time_from = parseInt(G.request['time_from']) || (moment().unix() - 86400 * 365);
	var time_to   = parseInt(G.request['time_to']) || (moment().unix());

	var df = new Date(),
		dt = new Date();
	df.setTime(time_from * 1000);
	dt.setTime(time_to * 1000);

	var $fy = $('#input-kw-f-y').val(df.getFullYear());
	var $fm = $('#input-kw-f-m').val(df.getMonth() + 1);
	var $fd = $('#input-kw-f-d').val(df.getDate());

	var $ty = $('#input-kw-t-y').val(dt.getFullYear());
	var $tm = $('#input-kw-t-m').val(dt.getMonth() + 1);
	var $td = $('#input-kw-t-d').val(dt.getDate());

	var $iptKw = $('#input-kw').val(G.request['keywords'] || '');


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
		var kw = $iptKw.val();
		var _df = new Date(
			parseInt($('#input-kw-f-y').val()),
			parseInt($('#input-kw-f-m').val()) - 1,
			parseInt($('#input-kw-f-d').val())
		);
		var _dt = new Date(
			parseInt($('#input-kw-t-y').val()),
			parseInt($('#input-kw-t-m').val()) - 1,
			parseInt($('#input-kw-t-d').val())
		);
		var _tf = Math.floor(_df.getTime() / 1000);
		var _tt = Math.floor(_dt.getTime() / 1000);
		if(!kw.length){
			return;
		}
		G.go(G.url('index', 'file', {
			keywords    : kw,
			time_from   : _tf,
			time_to     : _tt,
			filenumType : (options.filenumType || ''),
			filenumYear : (options.filenumYear || ''),
			filenumNum  : $('#filenum-num').val(),
			menucat     : options.menucat || '',
			themecat    : options.themecat || '',
			subcat      : options.subcat || '',
			advance     : 'true'
		}));
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