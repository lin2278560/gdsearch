$(function(){

	$('#left-part').bindOptionPart({
		varname : 'searchtype'
	});

	$('#division').bindOptionDrag({
		varname : 'division'
	});

	$('#onlineservice').bindOptionDrag({
		varname : 'onlineservice'
	});

	if(G.request['searchtype'] && G.request['searchtype'] != 'SERVICEITEM'){
		$('#onlineservice').hide();
	}

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
		G.go(G.url('index', 'bsxx', {
			keywords : G.request['keywords'] || '',
			searchtype : options['searchtype'] || '',
			division : options['division'] || '',
			onlineservice : options['onlineservice'] || '',
		}));
	});

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
		G.call('search.bsxx', m, function(c, d){
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