$(function(){

	ui('#btn-reply-letter', {
		click : function(){
			ui.inputArea({
				text  : '请输入回复的邮件内容',
				value : '',
				okCallback : function(v){
					G.call('letter.reply', {
						id : window._letterId,
						content : v
					}, function(c, d){
						location.reload();
					}, function(c, m){
						G.error(m);
					});
				}
			});
		}
	});

	ui('#btn-reject-letter', {
		click : function(){
			ui.confirm({
				text : '确定要标记为无效留言吗？',
				okCallback : function(){
					G.call('letter.reject', {
						id : window._letterId
					}, function(c, d){
						location.reload();
					}, function(c, m){
						G.error(m);
					});
				}
			});
		}
	});



});