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

	$('#advance-search-go').click(function(){
		var kw = $iptKw.val();
		if(!kw.length){
			return;
		}
		G.go(G.url('index', 'bsxx', {
			keywords : kw,
			searchtype : options['searchtype'] || '',
			division : options['division'] || '',
			onlineservice : options['onlineservice'] || '',
			advance : 'true'
		}));
	});

	if("advance" in G.request){
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
		if(!("keywords" in m) || m.keywords.length < 1){
			$('#list-body').empty();
			return;
		}
		G.call('search.bsxx', m, function(c, d){
			$doc = $('<div>' + d.result + '</div>');
			function qm(pt, wd){
			    var r = pt.exec(wd);
			    if(r && r.length && r.length > 1){
			        return r[1];
			    }else{
			        return undefined;
			    }
			}
			function qs($ct){
		        var rsAmount = qm(/共找到([\d]+)条数据/, $ct.html()) || 0;
		        var rsPages = [];
		        $ct.find('#pagelist a').each(function(){
		            if(this.className == 'curpage'){
		                rsPages.push({
		                    url  : '#',
		                    text : $(this).html()
		                });
		            }else{
		                rsPages.push({
		                    url  : 'javascript:' + (($(this).attr('onclick'))),
		                    text : $(this).html()
		                });
		            }
		        });
		        var rsNavs = [];
		        $ct.find('.itempanel').each(function(){
		            var $a = $(this).find('a');
		            var $contentDiv = $(this).find('.content');
		            var contentsMap = $contentDiv.map(function(){
		                    return $(this).html().replace(/\n+/g, "\n").replace(/\n/g, "<br>").replace(/<em>/g, '<font color="#C0392B">').replace(/<\/em>/g, '</font>');
		            });
		            var i;
		            var content = '';
		            for(i = 0; i < contentsMap.length; i ++){
		            	content += contentsMap[i];
		            }
		            rsNavs.push({
		                content : content,
		                date : '',
		                url : ($a.attr('href')),
		                title : $a.html().replace(/<em>/g, '<font color="#C0392B">').replace(/<\/em>/g, '</font>')
		            });
		        });
		        return {
		            amount : rsAmount,
		            pages : rsPages,
		            navs : rsNavs
		        };
		    }
		    var qsrs = qs($doc);
			$('#page-list').refreshPage({
				cur : G.request['page'] || 1,
				max : Math.ceil(qsrs.amount / 10)
			});
			$('#list-body').refreshList({
				list : qsrs.navs
			});
		}, function(c, m){
			alert(m)
		});
	})(G.request);

});
