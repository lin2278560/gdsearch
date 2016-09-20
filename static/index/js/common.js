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

		doSearch();

	});
	$typeDrag.find('.item').each(function(){
		if($(this).attr('key') == window.type){
			$typeDrag.find('.selected').html($(this).html());
		}
	});

	var $searchButton = $('#search-button').click(function(){
		doSearch(true);
	});

	var $advanceSearchButton = $('#advance-search-button');

	var $inputKeywords = $('#input-keywords').keyup(function(e){
		if(e.keyCode == 13){
			doSearch(true);
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
		},
		asTimeSelect : function(option){
			var $label = $(this).find('.label');
			var $input = $(this).find('input');
			var $calendar = $('<div class="calendar"></div>');
			var $dayTable = $('<div class="day-table"></div>');
			var $curYear  = $('<div class="cur-year"></div>');
			var $curMonth  = $('<div class="cur-month"></div>');
			var date = new Date();
			var showing = false, ipclick = false;
			option = option || {};
			option.time = option.time || ((option.varname in G.request) ? parseInt(G.request[option.varname]) : 0);
			$calendar.append(
				$('<div class="hd"></div>').append(
					$('<div class="prev-year"></div>').mousedown(prevYear),
					$curYear,
					$('<div class="next-year"></div>').mousedown(nextYear),
					$('<div class="next-month"></div>').mousedown(nextMonth),
					$curMonth,
					$('<div class="prev-month"></div>').mousedown(prevMonth)
				),
				$('<div class="week-line"><div class="week-item">日</div><div class="week-item">一</div><div class="week-item">二</div><div class="week-item">三</div><div class="week-item">四</div><div class="week-item">五</div><div class="week-item">六</div></div>'),
				$dayTable
			);

			$input.mousedown(function(){
				ipclick = true;
			}).mouseup(function(){
				ipclick = false;
			}).click(function(){
				if(!showing){
					showing = true;
					$calendar.show();
					refresh();
					$(window).on('mousedown', onmu);
				}
			}).keyup(function(){
				if(!$input.val().length){
					delete window.options[option.varname];
					$label.hide();
					return;
				}
				var v = checkFormat();
				if(v <= 0){
					$label.show();
				}else{
					$label.hide();
					date.setTime(v * 1000);
					refresh(false);
					window.options[option.varname] = v;
				}
			});
			$calendar.mousedown(function(){
				return false;
			}).on('click', '.day', function(){
				var d = this.innerHTML;
				if(d && d.length){
					date.setDate(d);
					refresh(true);
				}
			});


			$(this).append($calendar);

			if(option.time){
				date.setTime(option.time * 1000);
				refresh(true);
			}

			this.val = function(v){
				if(v === undefined){
					if($input.val().length){
						v = checkFormat();
						if(v > 0){
							return v;
						}else{
							return 0;
						}
					}else{
						return 0;
					}
				}else{
					date.setTime(v * 1000);
					refresh();
				}
			}

			return this;

			function checkFormat(){
				var v = $input.val();
				var a = v.split('-');
				if(a.length != 3){
					return -1;
				}
				var y = parseInt(a[0]),
					m = parseInt(a[1]),
					d = parseInt(a[2]);
				if(isNaN(y) || y < 1970 || y > 9999){
					return -2;
				}
				if(isNaN(m) || m < 1 || m > 12){
					return -3;
				}
				if(isNaN(d) || d < 1 || d > 31){
					return -4;
				}
				a = new Date();
				return moment(y + '-' + m + '-' + d).unix();
			}

			function onmu(){
				if(ipclick){
					return;
				}
				showing = false;
				$calendar.hide();
				$(window).off('mousedown', onmu);
			}

			function prevYear(){
				date.setFullYear(date.getFullYear() - 1);
				refresh();
				return false;
			}

			function nextYear(){
				date.setFullYear(date.getFullYear() + 1);
				refresh();
				return false;
			}

			function prevMonth(){
				date.setMonth(date.getMonth() - 1);
				refresh();
				return false;
			}

			function nextMonth(){
				date.setMonth(date.getMonth() + 1);
				refresh();
				return false;
			}

			function refresh(setInputVal){
				var year  = year  || date.getFullYear();
				var month = month || (date.getMonth() + 1);
				var day   = day   || date.getDate();
				$curYear.html(year);
				$curMonth.html(month);
				var day_offset = weekDay(year, month, 1);
				var mon_days   = monDays(year, month);
				var i, d, n = 0;
				$dayTable.empty();
				for(i = 0; i < day_offset; i ++){
					n ++;
					$dayTable.append(makeDay());
				}
				for(i = 1; i <= mon_days; i ++){
					n ++;
					$dayTable.append(makeDay(i, i == day));
				}
				for(i = 0; i < (7 - n % 7); i ++){
					$dayTable.append(makeDay());
				}
				if((setInputVal !== false) && (setInputVal || $input.val().length)){
					$input.val(moment(date).format('YYYY-MM-DD'));
					window.options[option.varname] = moment(date).unix();
				}
			}

			function makeDay(s, cur){
				var d = document.createElement('div');
				d.className = 'day';
				if(s){
					d.innerHTML = s;
					d.className += ' ac';
					if(cur){
						d.className += ' cur';
					}
				}
				return d;
			}
		}
	});

	function doSearch(normalSearch){
		var kw = $inputKeywords.val();
		if(!kw.length){
			return;
		}
		var data = {
			keywords : kw
		};
		if(normalSearch !== true && window.advance){
			data.advance = 'true';
		}
		G.go(G.url('index', type, data));
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

	function monOffset(year, month) {
		var i, offset;
		for (i = 1, offset = 0; i < month; i ++) {
			offset += monDays(year, i);
		}
		return offset;
	}
	function monDays(year, month){
		return (month == 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) ? 29 : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
	}
	function weekDay(year, month, day){
		function i(n){ return parseInt((year - 1) / n); }
		return (i(1) + i(4) - i(100) + i(400) + monOffset(year, month) + day) % 7;
	}

});