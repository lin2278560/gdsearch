$(function(){

	var adminMenu = ui('#admin-menu');
	adminMenu.$.on('click', '.hd', function(){
		$(this).parent().toggleClass('folded');
	}).find('.item').each(function(){
		if(!this.href){
			this.href = G.url(this.dataset.c, this.dataset.a);
		}
		if(this.dataset.c.toLowerCase() == _RG.navi_controller.toLowerCase() && this.dataset.a.toLowerCase() == _RG.navi_action.toLowerCase()){
			$(this).addClass('selected');
		}
	});


});


(function(){
    var d = document.createElement('div');
    var to_test = ['t', 'webkitT', 'mozT'];
    var i;
    for(i = 0; i < to_test.length; i ++){
        if((to_test[i] + 'ransform') in d.style){
            return;
        }
    }
    if(!('dataset' in document.documentElement)){
        document.location.href = './?c=index&a=browser';
    }
})();