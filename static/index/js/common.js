$(function(){

	window.originType = window.type = _RG.action;
	window.options = {};
	window.advance = false;
	var $typeDrag = $('#type-drag').on('click', '.item', function(){

		type = $(this).attr('key');
		$typeDrag.find('.selected').html($(this).html());


		switch(type){
			case 'local':
			case 'file':
			case 'bsxx':
				$advanceSearchButton.show();
				break;
			default:
				$advanceSearchButton.hide();
				break;
		}

	});
	$typeDrag.find('.item').each(function(){
		if($(this).attr('key') == window.type){
			$typeDrag.find('.selected').html($(this).html());
		}
	});

	var $searchButton = $('#search-button').click(function(){
		doSearch();
	});

	var $advanceSearchButton = $('#advance-search-button');

	var $inputKeywords = $('#input-keywords').keyup(function(e){
		if(e.keyCode == 13){
			doSearch();
		}
	}).val(G.request['keywords'] || '');

	$.fn.extend({
		bindOptionDrag : function(option){
			var varName = option.varname;
			var map = {};
			var that = this;
			$(that).find('.item').each(function(){
				var k = $(this).attr('key');
				map[k] = this;
			});
			if(varName in G.request && G.request[varName] in map){
				that.value = $(map[G.request[varName]]).attr('key');
				$(that).find('.selected').html($(map[G.request[varName]]).html());
				options[varName] = that.value;
			}
			$(that).on('click', '.item', function(){
				var k = $(this).attr('key');
				$(that).find('.selected').html($(this).html());
				options[varName] = that.value = k;
				if(option.callback){
					option.callback.call(that, k);
				}
			});
		},
		bindOptionPart : function(option){
			var varName = option.varname;
			var map = {};
			var that = this;
			$(that).find('.item').each(function(){
				var k = $(this).attr('key');
				map[k] = this;
				if(this.tagName == 'A' || this.tagName == 'a'){
					$(this).attr('href', makeURLWithin(varName, k));
				}
			});
			if(varName in G.request && G.request[varName] in map){
				$(map[G.request[varName]]).addClass('selected');
				that.value = $(map[G.request[varName]]).attr('key');
				options[varName] = that.value;
			}else{
				$(that).find('.item').eq(0).addClass('selected');
			}
			$(that).on('click', '.item', function(){
				var k = $(this).attr('key');
				$(this).addClass('selected').siblings().removeClass('selected');
				options[varName] = that.value = k;
				if(option.callback){
					option.callback.call(that, k);
				}
			});
		},
		refreshList : function(option){
			$(this).empty();
			var i;
			for(i = 0; i < option.list.length; i ++){
				$(this).append(genListItem(option.list[i]));
			}
			if(option.list.length == 0){
				$(this).html('<div class="empty-list"></div>');
			}
		},
		refreshPage : function(option){
			var cur = parseInt(option.cur);
			var max = parseInt(option.max);
			var from = cur - 5;
			if(from <= 0){
				from = 1;
			}
			var to = cur + 5;
			if(to > max){
				to = max;
			}
			if(from != 1){
				$(this).append(genPageItem(1, '第一页'));
			}
			while(from <= to){
				$(this).append(genPageItem(from, from, cur));
				from ++;
			}
			if(to != max){
				$(this).append(genPageItem(max, '最后一页'));
			}
		}
	});

	function doSearch(){
		var kw = $inputKeywords.val();
		if(!kw.length){
			return;
		}
		G.go(G.url('index', type, {
			keywords : kw
		}));
	}

	function makeURLWithin(varName, value){
		var i, m = {};
		m[varName] = value;
		for(i in G.request){
			if(i != varName && i != 'c' && i != 'a'){
				m[i] = G.request[i];
			}
		}
		if("timeRange" in m){
			delete m['time_from'];
			delete m['time_to'];
		}
		return G.url('index', originType, m);
	}

	function goOrigin(){
		G.go(G.url('index', originType, options));
	}

	function genListItem(d){
		return $('<div class="list-item"><a class="title" href="'+d.url+'" target="_blank">'+d.title+'</a><div class="url">'+d.url+'</div><div class="content">'+d.content+'</div><div class="publisher">'+(d.publisher || '')+'</div><div class="date">'+d.date+'</div></div>');
	}

	function genPageItem(n, text, cur){
		return $('<a class="item'+ (cur == n ? ' cur' : '') +'" href="'+makeURLWithin('page', n)+'">'+(text || n)+'</a>');
	}

});