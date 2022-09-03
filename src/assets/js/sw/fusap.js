

/***************************************************
 * 				PAGE LOAD
 **************************************************/

function loadPage(url) {
	
	loadPage(url, null);
}

function loadPage(url, data) {
	
	/* triiger after post */
	jQuery.event.trigger('beforeSubmit');
	
	responseResult = jQuery('<div>');		
	responseResult.load(
		url, data, 
		function( response, status, xhr ) {
			if (status == "error") {
				setGenericError();
			}
			else {
				$('.page-content').html('');
				$('.page-content').append(responseResult.children('.page-content').html());
				
				message = $('#messageList');
				
				clearMessages();
				
				if(message.size() > 0) {
					setResponseMessage({
						type: message.children().get(0).tagName.toLowerCase(), 
						label: message.children().first().attr('label'), 
						message: message.children().first().attr('message')	
					});
					markErrors();
				}
				
				setInputMasks();
				
				/* Prevent submit data */
				$('form').submit(function() {
			        jQuery.event.trigger('beforeSubmit');
			        return true;
			    });
				
				if (typeof setActionsPostLoad == 'function') { 
					setActionsPostLoad(); 
				}
			}
			
			$("body").animate({ scrollTop: 0 }, 0);
		});
}


// Objeto para el manejo de eventos
var GRAL_EVENT_HANDLER = {};

/* *************************************************
 * 					WAIT-BOX
 **************************************************/

$(document).on({
	ajaxStart: function() {
		if($('#waitBox').size() == 0) {
			crearWaitBox();
		}
		$.blockUI({ 
        	message: $('#waitBox'),
        	css: { 
	            border: 'none', 
	            padding: '15px', 
	            backgroundColor: 'transparent',
	            color: '#fff'
			}
        });   
	},
	ajaxStop: function() { 
		$.unblockUI();
	}
});

function crearWaitBox() {
	$(document).find('body').append('<div id="waitBox" style="display: none;"><img alt="img" src="images/spinner.gif" style="width: 60px; height: 60px;"></div>');
}


/***************************************************
 * 				MESSAGE FUNCTIONS
 **************************************************/

function clearMessages(parent) {
	
	if (parent) {
		parent.find('.cloned').remove();
	} else {
		$('#messages .cloned').remove();
	}
	
}

function setMessage(newMessage, title, message, parent) {
	
	clearMessages(parent);
	
	newMessage.attr('id', newMessage.attr('id') + '_cloned');
	newMessage.addClass('cloned');
	newMessage.find('strong').html(title);
	newMessage.find('span').html(message);
	newMessage.css('display', '');
	
	var container = parent || $('#messages');
	container.append(newMessage);
	
}

function addMessage(newMessage, title, message) {
	
	newMessage.attr('id', newMessage.attr('id') + '_cloned');
	newMessage.addClass('cloned');
	newMessage.find('strong').html(title);
	newMessage.find('span').html(message);
	newMessage.css('display', '');
	
	$('#messages').append(newMessage);
}

function setSuccess(title, message, parent) {
		
	setMessage($('#success_message').clone(), title, message, parent);
}

function setInformation(title, message, parent) {
	
	setMessage($('#information_message').clone(), title, message, parent);
}

function setWarning(title, message, parent) {
	
	setMessage($('#warning_message').clone(), title, message, parent);
}

function setError(title, message, parent) {
	
	setMessage($('#error_message').clone(), title, message, parent);
}

function setResponseMessage(response, parent) {
		
	if(response.type == 'success') {
		setSuccess(response.label, response.message, parent)
	}
	else if(response.type == 'information') {
		setInformation(response.label, response.message, parent)
	}
	else if(response.type == 'warning') {
		setWarning(response.label, response.message, parent)
	}
	else if(response.type == 'error') {
		setError(response.label, response.message, parent)
	}
}

function addResponseMessage(response) {
	
	if(response.type == 'success') {
		addMessage($('#success_message').clone(), response.label, response.message)
	}
	else if(response.type == 'information') {
		addMessage($('#information_message').clone(), response.label, response.message)
	}
	else if(response.type == 'warning') {
		addMessage($('#warning_message').clone(), response.label, response.message)
	}
	else if(response.type == 'error') {
		addMessage($('#error_message').clone(), response.label, response.message)
	}
}

function setGenericError() {
	setError('Error inesperado:', 'Ha ocurrido un error en la aplicaci&oacute;n');
}

/*
 * 	Se procesan los mensajes en caso de existir 
 */
$(function() {
	
	clearMessages();
	
	$('#messageList').children().each(function() {
		addResponseMessage({
			type: $(this).get(0).tagName.toLowerCase(), 
			label: $(this).attr('label'), 
			message: $(this).attr('message')	
		});
	});
	
	$('#messageList').remove();
});	


/***************************************************
 * 				FUNCIONES INPUTS
 **************************************************/

// @param selectId: id del select
// @param lista: lista de objetos con atributos 'clave' y 'valor' 
function GRAL_llenarSelect(selectId, lista) {
	
	$('#' + selectId).empty();
	
	$('#' + selectId)
		.append(new $('<option>')
		.text('-- Seleccione --')
		.attr('value', '')
	);
	
	if (lista.length) {
		$.each(lista, function(index, element){
			$('#' + selectId)
				.append(new $('<option>')
				.text(element.valor)
				.attr('value', element.clave)
			);
		})
	}
}

function GRAL_limpiarForm(idForm) {
	
	$("#" + idForm).find('input:text, input:password, input:file, select, textarea').val('');
	$("#" + idForm).find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
	
}

function GRAL_datepicker(object) {
	
    object.not("div").datepicker({
    	language: 'es',
    	format: 'dd/mm/yyyy',
    	autoclose: true,
        todayHighlight: true
    });
	object.not("div").change(function(ev) {
        $(this).keyup();             
    });
}

$(document).ready(function(){
	setInputMasks();
});


function setInputMasks() {
	$(".numeric").numeric();
    GRAL_datepicker($(".date"));
    $(".time").mask("29:59");
    $(".inputDate").mask("39/19/9999");
}

function setRowInputMasks(elem) {
	elem.find(".numeric").numeric();
    GRAL_datepicker(elem.find(".date"));
    elem.find(".time").mask("29:59");
    elem.find(".inputDate").mask("39/19/9999");
}

/***************************************************
 * 				EXAMENES
 **************************************************/

function limitTextarea(e) {
    var key = e.keyCode;

	// If the user has pressed enter
	if (key == 13) {
		return false;
	}
	else {
		return true;
	}
}

/***************************************************
 * 				ERRORES
 **************************************************/

function markErrors() {
	
	$('span.error').each(function() {
	
		input = $(this).prev();
		
		/* Multiples errores */
		if(input.get(0).tagName == 'SPAN' && input.hasClass('error')) 
		{
			input.after('<br>');			
		}
		else 
		{					
			if(input.get(0).tagName == 'TABLE') {
				input.css('border', '1px solid Red');
				input.after('<br>');
			}
			
			if(input.get(0).tagName == 'INPUT')
				input.css('border', '1px solid Red');
			
			if(input.get(0).tagName == 'SELECT')
				input.css('border', '1px solid Red');
		}
	});
}	



/***************************************************
 * 				Navegacion
 **************************************************/

function cancelar() {
	history.back();	
}



/***************************************************
 * 				ICHECK
 **************************************************/

$(document).ready(function () {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
});