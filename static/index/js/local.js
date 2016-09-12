$(function(){

	$('#left-part').bindOptionPart({
		varname : 'timeRange'
	});
	$('#sort-line').bindOptionPart({
		varname : 'order'
	});
	$('#position-select').bindOptionPart({
		varname : 'position'
	});
	$('#advance-search-button').mousedown(function(){
		window.advance = !window.advance;
		if(window.advance){
			$('.advance-search').slideDown();
			$('.normal-search').slideUp();
		}else{
			$('.advance-search').slideUp();
			$('.normal-search').slideDown();
		}
		return false;
	});
	$('#advance-search-go').click(function(){
		var kwInclude = $iptInclude.val();
		var kwExclude = $iptExclude.val();
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
		if(!kwInclude.length){
			return;
		}
		G.go(G.url('index', 'local', {
			keywords : kwInclude,
			keywords_not : kwExclude,
			time_from : _tf,
			time_to : _tt,
			position : window.options.position || 'all',
		}));
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

	var $iptInclude = $('#input-kw-include').val(G.request['keywords'] || '');
	var $iptExclude = $('#input-kw-exclude').val(G.request['keywords_not' || '']);

	if("advance" in G.request){
		$('#advance-search-button').mousedown();
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
				list : d.list
			});
		}, function(c, m){
			alert(m)
		});
	})(G.request);
});