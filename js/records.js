form237B_html = '<div id="form237B"> FORM 237B </br> </br> I, Aster [last name] (hereafter referred to as CLIENT), hereby authorize any duly credentialed medical practitioners at Hope and Mercy Medical Center (and affiliated treatment facilities), under the alias FixMyMentals, to EXPERIMENTAL AMNESIA THERAPY (see definition below). I recognize that I have consented to this therapy under my own volition and in the absence of coercion on the part of any guardians, companions, or employers. </br> </br> EXPERIMENTAL AMNESIA THERAPY includes, but is not limited to, the following procedures: </br> </br> The removal and subsequent analysis of CLIENT\'s supplemental memory, processing, and sensory units by hospital staff </br> Medically-induced amnesia in CLIENT </br> Alterations to CLIENT\'s supplemental memory, processing, and sensory units in order to reverse damage that CLIENT committed to such units prior to check-in at Hope and Mercy Medical Center </br> Communications between hospital staff and CLIENT pertaining to the retrieval of information pertinent to the repair of CLIENT\'s memory, processing, and sensory units </br> </br> In addition to the above terms and conditions, by signing below, the CLIENT swears by the following statements:</br> I understand that my personal and medical information, including any and all unencrypted memories stored in my supplemental memory unit(s), will be available to hospital staff for the purposes of repairing said unit(s)</br> I authorize hospital staff to attempt to decrypt any and all memories that they have REASONABLE SUSPICION may have contributed to the harm I caused myself</br> I recognize that EXPERIMENTAL AMNESIA THERAPY is an experimental treatment, and therefore may not produce the precise results that I or hospital staff anticipated upon check-in</br> I agree NOT to read Form 237B or any related form under ANY CIRCUMSTANCES, understanding that doing so voids the possibility of recovery pursuant to the definition of EXPERIMENTAL AMNESIA THERAPY</br></br> Signed,</br></br> [Mom\'s first and last name]______ </br> Client or Legal Guardian Signature </br></br> CLIENT CONFIRMATION INFO</br></br> Date of birth: 26/1/48</br> SSN: 439-65-1970</br> </div>'

pdr_html = '<div id="pdr"> <form id="census_form"> <input id="checktest" type="text" placeholder="Name"/> <input type="text" placeholder="SSN"/> <input type="text" placeholder="DOB"/> <input type="text" placeholder="Race/Ethnicity"/> <input type="text" placeholder="Gender"/> <fieldset data-role="controlgroup" data-type="horizontal"> <input type="radio" name="citizen" id="citizen_yes"/> <label for="citizen_yes">Citizen</label> <input type="radio" name="citizen" id="citizen_no"/> <label for="citizen_no">Non-Citizen</label> </fieldset> <fieldset id="citizen_choices" hidden="true"> <input type="text" placeholder="Country of Origin"/> <input type="text" placeholder="Duration of Stay"/> </fieldset> <fieldset data-role="controlgroup" data-type="horizontal"> <input type="radio" name="employed" id="employed_yes"/> <label for="employed_yes">Employed</label> <input type="radio" name="employed" id="employed_no"/> <label for="employed_no">Unemployed</label> </fieldset> <fieldset id="employed_choices" hidden="true"> <input type="text" placeholder="Job Title"/> <input type="text" placeholder="Employer"/> </fieldset> </form> </div>'

password_popup_html = '<div id="237B_password" data-overlay-theme="b" data-theme="b" data-role="popup" data-dismissible="false" class="ui-corner-all"> <div data-role="header" class="ui-corner-top"> <h1>Encryption</h1> </div> <div role="main" class="ui-corner-bottom ui-content"> <p>This form requires a password.</p> <input id="237B_input" type="text" placeholder="Password"/> <a id="237B_passwordback" href="#" class="ui-btn ui-btn-a ui-corner-all ui-shadow ui-btn-inline" data-rel="back">Back</a> <a id="237B_button" href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline">Enter</a> </div> </div>'

$(document).ready(function() {
	$('#237B_listitem').append(password_popup_html);

	$('input:radio').change(
	function(){
	    if($(this).attr('id') == 'citizen_yes'){
	        $('#citizen_choices').children().each(function(){
	        	$(this).val('');
	        });
	        $('#citizen_choices').slideUp();
	    }
	    else if ($(this).attr('id') == 'citizen_no'){
	        $('#citizen_choices').slideDown();
	    }
	    else if($(this).attr('id') == 'employed_no'){
	    	$('#employed_choices').children().each(function(){
	    		$(this).val('');
	    	});
	    	$('#employed_choices').slideUp();
	    }
	    else if ($(this).attr('id') == 'employed_yes'){
	    	$('#employed_choices').slideDown();
	    }
	});

	$('#237B_passwordback').click( function(){
		$('#237B_input').val('');
	});

	$('#pdr_listitem').click(function(){
		$('#records_title h2').text('Personal Data Request');
		$('#records_content')
			.empty()
			.html(pdr_html)
			.trigger('create');
	});
	
	$('#237B_input').keydown( function(event){
		if (event.keyCode == 13) {
			$('#237B_button').click();
		}
	});

	$('#237B_button').click( function() {
		if ($('#237B_input').val()==='password')
		{
			$('#237B_passwordback').click();

			$('#237B_listitem').fadeOut( 'slow', function(){
				var div = $('<li id="237B_listitem"><a id="237B_link" href="#records_view" data-transition="slide">Form 237B</a></li>').hide();
				$(this).replaceWith(div);
				$('#records_list').listview('refresh');
				$('#237B_listitem').fadeIn('slow');

				$('#237B_listitem').click( function(){
					$('#records_title h2').text('Form 237B');
					$('#records_content')
						.empty()
						.html(form237B_html)
						.trigger('create');
				});

				$('#records_list').listview('refresh');
			});
			
			
		}
		else {
			$('#237B_password').effect('shake',{times:2});
			$('#237B_input').val('');
		}
	});
});