$(function(){

	$('#left-part').bindOptionPart({
		varname : 'timeRange'
	});
	$('#sort-line').bindOptionPart({
		varname : 'order'
	});
	$('#sort-select').bindOptionPart({
		varname : 'order'
	});
	$('#position-select').bindOptionPart({
		varname : 'position'
	});
	$('#advance-search-button-show').mousedown(function(){
		window.advance = true;
        sessionStorage.setItem('isShow','1');
		$('.advance-search').slideDown();
		$('.normal-search').slideUp();
		return false;
	});
	$('#advance-search-button-fold').mousedown(function(){
		window.advance = false;
        sessionStorage.setItem('isShow','0');
		$('.advance-search').slideUp();
		$('.normal-search').slideDown();
		return false;
	});
	$('#advance-search-go').click(function(){
		var i;
		var toCheck = ['order', 'time_from', 'time_to'];
		var args = {
			keywords : $iptInclude.val(),
			keywords_not : $iptExclude.val(),
			advance : 'true',
			order : 'order' in window.options ? window.options.order : '0',
			position : 'position' in window.options ? window.options.position : 'all',
		};
		for(i = 0; i < toCheck.length; i ++){
			if(toCheck[i] in window.options){
				args[toCheck[i]] = window.options[toCheck[i]];
			}
		}
		G.go(G.url('index', 'local', args));
	});

	var $timeFrom = $('#time-from').asTimeSelect({
		varname : 'time_from'
	});
	var $timeTo   = $('#time-to').asTimeSelect({
		varname : 'time_to'
	});

	var $iptInclude = $('#input-kw-include').val(G.request['keywords'] || '');
	var $iptExclude = $('#input-kw-exclude').val(G.request['keywords_not' || '']);

	if("advance" in G.request && sessionStorage.getItem('isShow')=='1'){
		$('#advance-search-button-show').mousedown();
	}
	(function(o){
		var m = {};
		var i;
		for(i in o){
			if(i != 'c' && i != 'a'){
				m[i] = o[i];
			}
		}
		if("timeRange" in m){
			m['time_to'] = moment().unix();
			switch(m['timeRange']){
				case 'day':
					m['time_from'] = m['time_to'] - 86400;
					break;
				case 'week':
					m['time_from'] = m['time_to'] - 86400 * 7;
					break;
				case 'month':
					m['time_from'] = m['time_to'] - 86400 * 31;
					break;
				case 'year':
					m['time_from'] = m['time_to'] - 86400 * 365;
					break;
			}
			delete m['timeRange'];
		}
		if(!("keywords" in m) || m.keywords.length < 1){
			$('#list-body').empty();
			return;
		}
		G.call('search.local', m, function(c, d){
			$('#page-list').refreshPage({
				cur : G.request['page'] || 1,
				max : d.page_total
			});
			$('#list-body').refreshList({
				list : d.list,
				total : d.total
			});
		}, function(c, m){
			alert(m)
		});
	})(G.request);
});