// FOR MESSAGING APP
msgsData = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'json/msg.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})(); 

contactsArray = Object.keys(msgsData);
//contactsArray=contactsArray.sort(); //alphabetize

allMsgs = {};
lastMsgs = {};
responseBars = {};
counterArray = {};

for(var i=0; i < contactsArray.length; i++) {
	allMsgs[contactsArray[i]] = '';
	lastMsgs[contactsArray[i]] = '';
	responseBars[contactsArray[i]] = $([]);
	counterArray[contactsArray[i]] = 0;
}


// RUNS WHEN THE DOM LOADS
$(document).ready(function() {

	$('#msging').on('pageshow', function(){
		scrollToBottom();
		$('#msgs_list').listview('refresh');
	});

    $('#contacts_header h2').text('Contacts ('+contactsArray.length.toString()+')') // set up header with number of contacts
    
    for (var i=0; i<contactsArray.length; i++) // loop through contacts and create the contacts screen
    {
    	$('<li><a href="#msging" id="contact-'+contactsArray[i]+'" data-transition="slide"><h1 style="display:inline">'+contactsArray[i]+'</h1><pre class="lastmsg">'+lastMsgs[contactsArray[i]]+'</pre></a></li>')
    			.appendTo('#contacts_list')
    			.click(setupMessageScreen(contactsArray[i]));
    }

    $errorResponseBar = $('<div>').navbar({
    	id: 'msg_response_navbar'
    }).append('<ul id="msg_response_options"><li><a><span style="color:gray;">Error: No responses could be generated.</span></a></li></ul></div>');
    
    $('#sendbtn').click( function(){
    	if ($('#msg_input').val() != '') {
			printMsg($('#msg_header h2').text(), $('#msg_input').val(), '10:00AM', false);
			$('#msg_response_options').html('');
			$('#msg_list').listview('refresh');
		}
	}); 

	$('#msg_receive').click(function(){
		receiveMsg($('#msg_header h2').text());
	});
});


function receiveMsg(sender) {

	// initlialization / variables

	var thisPageID = $.mobile.pageContainer.pagecontainer('getActivePage').attr('id');

	var msg = msgsData[sender][counterArray[sender]];
	var msgText = msg.text;
	var msgTime = msg.time;
	var msgResponses = msg.responses;

	// creating message

	newMsgHtml = '<li class="response"><div class="responsetext">'+msgText+'</div></li>'; // define new message in html form
	
	allMsgs[sender] = allMsgs[sender].concat(newMsgHtml); // update allMsgs array to include new message

	lastMsgs[sender] = $(allMsgs[sender]).children().last().text(); // update lastMsgs array to include new message text

	$('#contacts_list').find('.lastmsg').each( function(i) {
		if (lastMsgs[contactsArray[i]] != undefined) 
		{
			$(this).text('   ' + lastMsgs[contactsArray[i]]);
		}
	});	// update all of the last messages in the contacts screen

	if (thisPageID != 'msging') 
	{
		$('#msg_list').html(''); // clear the message screen if we are not on the message screen
	}

	// setting up responses

	var $newResponseBar = $errorResponseBar.clone();

	if (msgResponses.length != 0) {

		$newResponseBar.empty();
		$newResponseList = $('<ul>');

		for (var i = 0; i < msgResponses.length; i++) 
		{
			$('<li><a href="#"><span>'+msgResponses[i]+'</span></a></li>')
				.click(onMsgResponseClick(msgResponses[i]))
				.appendTo($newResponseList);
		}

		$newResponseList.appendTo($newResponseBar);
	}

	responseBars[sender] = $newResponseBar;


	// trigger a notification
	
	if ((thisPageID != 'msging') && (thisPageID != 'contacts') && (notificationsPossible)) 
	{
		getNotification('Messaging','New message from '+sender, true, msgTime);
	}


	// make sure everything is styled and displayed correctly

	if (thisPageID == 'msging') { 
		$('#msg_list').append(newMsgHtml).listview('refresh');
		$('#msg_footer').children().first().remove();
		$('#msg_footer').prepend(responseBars[sender]).trigger('create');

	} // if we are already on the messaging screen, print the message immediately and update the responses bar.  otherwise, it will be stored and added to the screen later when we navigate there.

	scrollToBottom();

	counterArray[sender] = counterArray[sender] + 1;
}


function printMsg(contact, messageText, messageTime, isresponse)
{
	//Fires when you click the Send button (or press Enter).  Prints what you typed onto the screen.  If the message is "hi", starts countdown to a response.  Then empties the input box and updates the array of messages. 
	$('#msg_list')
		.append('<li class="msg"><div style="white-space:normal" class="msgtext">'+messageText+'</div></li>')
		.listview('refresh');

	$('#msg_input').val(''); //empty the input box
	
	allMsgs[contact] = $('#msg_list').html(); //store all the current messages in the variable allMsgs (in html format)
	
	lastMsgs[contact] = $('#msg_list').children().last().text(); //store the last message as a string in lastMsgs
	
	$('#contacts_list').find('.lastmsg').each( function(i) {
		$(this).text('  ' + lastMsgs[contactsArray[i]]);
	});	// add the last message to the contacts screen under the right contact

	scrollToBottom();
}

function setupMessageScreen(contact){
	return function(){
		$('#msg_header h2').text(contact);
		$('#msg_list').html(allMsgs[contact]).listview('refresh');
		$('msg_footer').prepend(responseBars[contact]).trigger('create');
		scrollToBottom();
	}
}

function onMsgResponseClick(response){
	return function(){
		$('#msg_input').val(response);
	}
}