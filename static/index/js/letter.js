$(function(){


	var toCheck = [
		'nickname', 'name',
		'idcard', 'phone',
		'email', 'career',
		'address', 'title',
		'content', 'vericode'
	];

	$('#vericode-frame').click(function(){
		$(this).empty();
		var img = new Image();
		img.src = G.url('vericode', 'simple', {
			t : Math.random()
		});
		$(this).append(img);
	});

	$('#letter-submit-button').click(function(){
		var data = {};
		var i;
		for(i = 0; i < toCheck.length; i ++){
			data[toCheck[i]] = $('#' + toCheck[i]).val();
			if(data[toCheck[i]].length == 0){
				alert('请先填写完整所有表单项');
				return;
			}
		}
		$(this).addClass('loading').html('正在提交…');
		console.log(data);
		G.call('letter.submit', data, function(c, d){
			$('#roger-frame').slideDown();
			$('#letter-frame').slideUp();
		}, function(c, m){
			alert(m);
		});
	});

});