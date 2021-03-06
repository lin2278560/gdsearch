$(function(){


	var tpl = ui('#tpl');

	var letterList = ui('#letter-list', {
		extend : {

			sp : ui('#sp-letter', {
				gotoPage : function(n){
					letterList.refresh(n - 1);
				}
			}),

			refresh : function(page){
				page = page || 0;
				var kw = $('#ipt-kw').val();
				var pageSize = 50;
				var offset   = page * pageSize;
				letterList.loading(true);
				G.call('letter.getList', {
					offset : offset,
					count  : pageSize,
					kw     : kw
				}, function(c, d){
					letterList.loading(false);
					letterList.$.empty();
					d.list.forEach(function(x){
						letterList.add(x);
					});
					letterList.sp.refresh(page + 1, Math.ceil(d.total / pageSize));
				}, function(c, m){
					G.error(m);
					letterList.loading(false);
				});
			},

			add : function(d){
				console.log(d);
				var e = tpl.dwLetterItem.clone();
				e.tData = d;
				e.dwTitle.innerHTML = d.title;
				e.dwNickname.dwText.innerHTML = d.nickname;
				e.dwDate.dwText.innerHTML = ui.time_to_str(d.time);
				e.dwCtrl.dwView.href = G.url('admin', 'viewLetter', {
					id : d.id
				});

				switch(d.status){

					case '1':
						e.dwCtrl.dwStatus.innerHTML = '待处理';
						$(e.dwCtrl.dwStatus).addClass('pending');
						break;

					case '2':
						e.dwCtrl.dwStatus.innerHTML = '投诉处理';
						$(e.dwCtrl.dwStatus).addClass('reject');
						break;

					case '3':
						e.dwCtrl.dwStatus.innerHTML = '已回复';
						$(e.dwCtrl.dwStatus).addClass('replied');
						break;

					case '4':
						e.dwCtrl.dwStatus.innerHTML = '无法回复';
						$(e.dwCtrl.dwStatus).addClass('invalid');
						break;
				}

				letterList.$.append(e);
				return e;
			}

		},
		events : {

			click : {
				selector : '.remove',
				handler  : function(){
					var $p = $(this).parent().parent();
					var id = $p[0].tData.id;
					G.call('letter.delete', {
						id : id
					}, function(c, d){
						$p.remove();
					}, function(c, m){
						G.error(m);
					});
				}
			}

		}
	});

	letterList.refresh();

	ui('#btn-search', {
		click : function(){
			letterList.refresh();
		}
	});

});