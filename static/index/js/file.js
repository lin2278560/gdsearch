$(function(){


    $('#left-part').bindOptionPart({
        varname : 'filenumType'
    });

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
		sessionStorage.setItem('isShow','1');
		$('.advance-search').slideDown();
		$('.normal-search').slideUp();
		$('#left-part').slideUp();
		return false;
	});
	$('#advance-search-button-fold').mousedown(function(){
		window.advance = false;
        sessionStorage.setItem('isShow','0');
		$('.advance-search').slideUp();
		$('.normal-search').slideDown();
        $('#left-part').slideDown();
		return false;
	});

	if("advance" in G.request && sessionStorage.getItem('isShow') == '1'){
		$('#advance-search-button-show').mousedown();
	}


	$('#advance-search-go').click(function(){
		var i;
		var toCheck = [
			'time_from', 'time_to', 
			'menucat', 'themecat', 'subcat',
			'filenumType', 'filenumYear'];
		var args = {
			keywords     : $iptInclude.val(),
			keywords_not : $iptExclude.val(),
			advance      : 'true',
			order : 'order' in window.options ? window.options.order : '0',
			position : 'position' in window.options ? window.options.position : 'all',
		};
		for(i = 0; i < toCheck.length; i ++){
			if(toCheck[i] in window.options){
				args[toCheck[i]] = window.options[toCheck[i]];
			}
		}
		if($('#filenum-num').val().length){
			args['filenumNum'] = $('#filenum-num').val();
		}
		G.go(G.url('index', 'file', args));
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
				list : d.list,
				total : d.total
			});
		}, function(c, m){
			alert(m);
		});

        $('#left-part>item').each(function () {
			m.filenumType = $(this).attr('key');
            G.call('search.filecount',m,function (c,d) {
				$(this).find('span').text(d.total);
            },function () {
                $(this).find('span').text(0);
            });
        });
	})(G.request);
});