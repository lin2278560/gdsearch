$(function(){

	$('#position-select').bindOptionPart({
		varname : 'position'
	});
	$('#start-year').bindOptionDrag({
		varname : 'start_year'
	});
	$('#end-year').bindOptionDrag({
		varname : 'end_year'
	});
	$('#periodical-text-year').bindOptionDrag({
		varname : 'periodical_text_year'
	});
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
	$('#advance-search-go').click(function(){
		var i;
		var toCheck = ['order', 'start_year', 'end_year', 'periodical_text_year', 'periodical_text_num'];
		var args = {
			keywords : $iptInclude.val(),
			keywords_not : $iptExclude.val(),
			advance : 'true',
			position : 'position' in window.options ? window.options.position : 'title',
		};
		for(i = 0; i < toCheck.length; i ++){
			if(toCheck[i] in window.options){
				args[toCheck[i]] = window.options[toCheck[i]];
			}
		}
		if($('#periodical-text-num').val().length > 0){
			args.periodical_text_num = $('#periodical-text-num').val();
		}
		G.go(G.url('index', 'gb', args));
	});


	var $iptInclude = $('#input-kw-include').val(G.request['keywords'] || '');
	var $iptExclude = $('#input-kw-exclude').val(G.request['keywords_not' || '']);
	var $iptPNum    = $('#periodical-text-num').val(G.request['periodical_text_num' || '']);

	if("advance" in G.request){
		// $('#advance-search-button-show').mousedown();
	}
	(function(o){
		var m = {};
		var i;
		for(i in o){
			if(i != 'c' && i != 'a'){
				m[i] = o[i];
			}
		}
		G.call('search.gb', m, function(c, d){
			var i;
			var $l = $('#list-body').empty();
			var last_year = '', last_num = '';
			var $fg;
			if(d.list.length == 0){
				$l.html('<div class="empty-list"></div>');
			}else{
				$l.append($('<div class="total-line">为您找到相关结果'+d.total+'个</div>'));
				for(i = 0; i < d.list.length; i ++){
					if(last_year != d.list[i].periodical_text_year || last_num != d.list[i].periodical_text_num){
						$fg = genListFragment(d.list[i]);
						$l.append($fg);
						last_num = d.list[i].periodical_text_num;
						last_year = d.list[i].periodical_text_year;
					}
					$fg.append(genListItem(d.list[i]));
				}
			}
			$('#page-list').refreshPage({
				cur : G.request['page'] || 1,
				max : d.page_total
			});
		}, function(c, m){
			alert(m)
		});
	})(G.request);

	function genListFragment(d){
		return $('<div class="list-fragment"><a class="fgtitle" href="'+d.menu_url+'" target="_blank">'+d.periodical_text_year+'年 第'+d.periodical_text_num+'期</a><a class="trans-goto" href="'+d.menu_url+'" target="_blank">查看本期公报</a></div>')
	}

	function genListItem(d){
		if(d.url.indexOf('http') >= 0){
			return $('<div class="list-item inner"><a class="title" href="'+d.url+'" target="_blank">'+d.title+'</a><div class="url">'+d.url+'</div><div class="content">'+d.content+'</div></div>');
		}else{
			return $('<div class="list-item inner"><div class="title">'+d.title+'</div><div class="url">'+d.url+'</div><div class="content">'+d.content+'</div></div>');
		}
	}
});