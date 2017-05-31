$(function(){


	var toCheck = [
		'nickname', 'name',
		'idcard', 'phone',
		'email', 'career',
		'address', 'title',
		'content', 'vericode'
	];

	var phoneNum;

	$('#vericode-frame').click(function(){

		if(!phoneNum){
			alert('请填入正确的手机号码');
			return;
		}

		var loading = $('#vericode-loading');
		var btn = $('#vericode-frame');

		G.call('letter.sms', {
			phone : phoneNum
		}, function(c, d){

			$(btn).hide();
			$(loading).show();
			checkLoading(60, loading, btn);

		}, function(c, m){
			G.error(m);
		});

	});

	var checkLoading = function(count, loading, btn){

		$(loading).text(count);

		setTimeout(function(){
			if(count > 1){
				count--;
				checkLoading(count, loading, btn);
			}else{
				$(btn).show();
				$(loading).hide();
			}
		},1000);

	}

	$('#mobi-vericode-frame').click(function(){

		if(!phoneNum){
			alert('请填入正确的手机号码');
			return;
		}

		var loading = $('#mobi-vericode-loading');
		var btn = $('#mobi-vericode-frame');

		G.call('letter.sms', {
			phone : phoneNum
		}, function(c, d){

			$(btn).hide();
			$(loading).show();
			checkLoading(60, loading, btn);

		}, function(c, m){
			G.error(m);
		});

	});

	$('#content').focus(function(){
		if($(this).val() == '请在此输入您所要留言的内容'){
			$(this).val('');
		}
	}).blur(function(){
		if($(this).val() == ''){
			$(this).val('请在此输入您所要留言的内容');
		}
	});

	$('#letter-submit-button').click(function(){
		var data = {};
		var i;
		for(i = 0; i < toCheck.length; i ++){
			data[toCheck[i]] = $('#' + toCheck[i]).val();
			if(toCheck[i] != 'idcard' && data[toCheck[i]].length == 0){
				alert('请先填写完整所有表单项');
				return;
			}
		}
		var that = this;
		$(this).addClass('loading').html('正在提交…');
		G.call('letter.submit', data, function(c, d){
			$('#roger-frame').slideDown();
			$('#letter-frame').slideUp();
			$(that).html('提交');
		}, function(c, m){
			alert(m);
			$(that).removeClass('loading');
			$(that).html('提交');
		});
	});

	$('#mobi-letter-submit-button').click(function(){
		var data = {};
		var i;
		for(i = 0; i < toCheck.length; i ++){
			data[toCheck[i]] = $('#mobi-' + toCheck[i]).val();
			if(toCheck[i] != 'idcard' && data[toCheck[i]].length == 0){
				alert('请先填写完整所有表单项');
				return;
			}
		}
		var that = this;
		$(this).addClass('loading').html('正在提交…');
		G.call('letter.submit', data, function(c, d){
			$('#page-done').show();
			$(that).html('提交');
		}, function(c, m){
			alert(m);
			$(that).removeClass('loading');
			$(that).html('提交');
		});
	});

	$('#email').blur(function(){
		if($(this).val().match(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)){
			$(this).parent().removeClass('warning');
		}else{
			$(this).parent().addClass('warning');
		}
	});

	$('#mobi-email').blur(function(){
		if($(this).val().match(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)){
			$(this).parent().parent().removeClass('weui_cell_warn');
		}else{
			$(this).parent().parent().addClass('weui_cell_warn');
		}
	});

	$('#phone').blur(function(){
		if($(this).val().match(/^1(3|4|5|7|8)[0-9]\d{8}$/)){
			$(this).parent().removeClass('warning');
			phoneNum = $(this).val();
		}else{
			$(this).parent().addClass('warning');
			phoneNum = null;
		}
	});

	$('#mobi-phone').blur(function(){
		if($(this).val().match(/^1(3|4|5|7|8)[0-9]\d{8}$/)){
			$(this).parent().parent().removeClass('weui_cell_warn');
			phoneNum = $(this).val();
		}else{
			$(this).parent().parent().addClass('weui_cell_warn');
			phoneNum = null;
		}
	});

});