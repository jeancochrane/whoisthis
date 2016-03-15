mailData = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'json/email.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})(); 

mailContacts = Object.keys(mailData);

glitchText = 'WŪŊȑ̮Ȓ ͆ǺǮsorr ǳƝ̵ǲɅ ɖ*ͤ͟ǰ ṿ̡ɣȁƠnoʻł ˆ̵ɤğʊǶʳ ȡLnexpectedô˒ʕ ̖(Ǳĕe˪į“̼ˮę ǍƖ_ʔƛû͕ɖ ɊɫɃƇɒɶ ŌșnþʬǶpleasƧ ʫư͋ʂ Ơɪ ͎updatȟʮÊā ɃRÄïƶ͙ȝƟ ĖǍɛ¨ȣǎ́ͦ®ĵ [Ɣ̓ûɜ ʬƹˠɴʓ ʛʎƦ ˾̰ŀƞ therŋ̍ Ɲƴ…ʟźdƻķ apologiz-ɗȨ̶D nÇ inconvƏŽ˽ȋə ʝVĉŶŒƎ'

glitched = false;

mailByThread = {};

$(document).ready(function() {
	// SET UP GLITCH DIALOG

	$('<div id="glitchdialog" data-overlay-theme="b" data-theme="b" data-role="popup" data-dismissible="false" class="ui-corner-all"><div data-role="header" class="glitch ui-corner-top"><h1>ƐʹŗªʁíŎʆĄǡĲ̌̎Ɍʢ˜¼ư̓Ŵ̾ʫɵŅɛ</h1></div><div id="glitchtext" role="main" class="ui-corner-bottom ui-content">'+glitchText+'</div><a id="glitchbtn" href="#" class="glitch ui-btn ui-corner-all ui-shadow ui-btn-inline" data-rel="back">Œ„I€ªwˆƒñ</a></div></div>').appendTo('#mail_options');

	$('#glitchtext').css({
		'white-space':'normal',
		'word-wrap':'break-word'
	});

	$('#mail_compose').click(function(){
		$('#glitchdialog')
		.children('.glitch')
		.each(function(){
			if (glitched === false){
				$(this).glitch({maxint:0.9,minint:0.1,maxglitch:50});
			}
		});
		glitched = true;
	});

	// SET UP RECEIVE BUTTON
	
	$('#mail_receive').click(function(){
		newMail('fixmymentals', 0);
	});
});

function newMail(sender, n)
{	
	var thisPageID = $.mobile.pageContainer.pagecontainer('getActivePage').attr('id');

	var email = mailData[sender][n];

	var mailText = email.text;
	var mailSender = email.sender;
	var mailTime = email.time;
	var mailSubject = email.subject;
	var mailResponses = email.responses;
	var threadID = mailSubject.replace(/\W/g, '')
	var newSubject = true;

	if (Object.keys(mailByThread).indexOf(threadID) >= 0) {
		newSubject = false
	}

	if (mailByThread[threadID] == undefined) {
		mailByThread[threadID] = '';
	}

	newMailHTML = '<div class="email"><h2>'+mailSubject+'</h2><p>'+mailText+'</p></div>';

	mailByThread[threadID] = newMailHTML.concat(mailByThread[threadID]);

	if (newSubject) {
		var newMailListItemHTML = '<li id="'+threadID+'" data-icon="false"><a href="#mail_view" data-transition="slide" class="unread-mail"><h1>'+mailSender+'</h1><p class="mail_subject">'+mailSubject+'</p><p class="mail_textpreview">'+$(mailText).eq(0).text()+'    '+$(mailText).eq(2).text()+'</p><p class="mail_time ui-li-aside">'+mailTime+'</p></a></li>';

		$(newMailListItemHTML)
		.hide()
		.appendTo('#mail_list')
		.slideDown()
		.children('a')
		.click(function(){
			$(this).removeClass('unread-mail'); 
			$('#mail_title h2').html(mailSender);
			$('#mail_content').html(mailByThread[threadID]);
			$('#mail_response_navbar').remove();
			$('<div id="mail_response_navbar" data-role="navbar"><ul id="mail_response_options"></ul></div>').prependTo('#mail_view_footer');

			if (mailResponses.length==0) {
				$('#mail_response_options').html('<li><a><span style="color:gray">Error: No responses could be generated</span></a></li>');
			} else {
				for (var i = 0; i < mailResponses.length; i++) {
					var response = mailResponses[i];
					var responseNum = i + 1;
					var responseid = sender+'-'+n.toString()+'-autoresponse-'+responseNum.toString();
					$('mail_response_options').html('');
					$('<li><a><span id="#autoresponse-'+responseNum.toString()+'">'+response+'</span></a></li>')
						.appendTo('#mail_response_options')
						.click(onMailResponseClick(response));
				}
			}
			$('#mail_view_footer').trigger('create');
		});
		if (thisPageID == 'mail_nav') {
			$('#mail_list').listview('refresh');
		}
	}

	else {
		$('#'+threadID)
		.children('a')
		.addClass('unread-mail')
		.off('click')
		.click(function(){
			$(this).removeClass('unread-mail').children('h1').text(mailSender);
			$('#mail_title h2').html(mailSender);
			$('#mail_content').html(mailByThread[threadID]);

			$('#mail_response_navbar').remove();
			$('<div id="mail_response_navbar" data-role="navbar"><ul id="mail_response_options"></ul></div>').prependTo('#mail_view_footer');

			// responses
			if (mailResponses.length==0) {
				$('#mail_response_options').html('<li><a><span style="color:gray">Error: No responses could be generated</span></a></li>');
			} else {
				for (var i = 0; i < mailResponses.length; i++) {
					var response = mailResponses[i];
					var responseNum = i + 1;
					var responseid = sender+'-'+n.toString()+'-autoresponse-'+responseNum.toString();
					$('#mail_response_options').html('');
					$('<li><a><span id="#autoresponse-'+responseNum.toString()+'">'+response+'</span></a></li>')
						.appendTo('#mail_response_options')
						.click(onMailResponseClick(response));
				}
			}

			$('#mail_view_footer').trigger('create');
		})
		.children('h1')
		.text(mailSender+'   ('+($(mailByThread[threadID]).length-1)+')');
	}

	if ((thisPageID != 'mail_nav') && (thisPageID != 'mail_view') && (notificationsPossible))
	{
		getNotification('Mail', 'New mail from '+mailSender, mailTime, true);
	}
}

function onMailResponseClick(response){
	return function(){
		
	}
}
