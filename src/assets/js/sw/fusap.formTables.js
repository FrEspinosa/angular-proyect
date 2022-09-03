(function ( $ ) {
 
    $.fn.FormTable = function( options ) {
 
    	/*
    	 * Valudo que exista la tabla que quiere renderizarse
    	 */
    	if(this.size() == 0)
    		return;
    	
    	
    	/*
		 * DIV que se le aplica la funcion de Tabla
		 */
    	var formTable = this; 
    	
    	
    	/*
		 * Datos necesarios para el uso de la libreria
		 */
        var settings = $.extend({
            dinamicRows: false,
			classTable: "form-table",
			postAddRow: function(row, rowIndex){},
			maxHeight: 110,
			preRemoveRow: function(row){}
        }, options );
 
        
        /*
		 * Se agrega la clase necesaria para dibujar la tabla
		 */
		this.addClass(settings.classTable);
		
		this.children('.row:odd').addClass('odd');
		this.children('.row:even').addClass('even');
		
		
		 /*
		 * Selector utilizado para obtener los datos
		 */
		var selector = 
			'[type=text][name^=' + settings.path + '], ' +
			'[type=hidden][name^=' + settings.path + '], ' +
			'[type=checkbox][name^=' + settings.path + '], ' +
			'[type=radio][name^=' + settings.path + ']:checked, ' +
			'select[name^=' + settings.path + ']';
		
		
		/*
		 * Funcion para eliminar una fila de datos
		 */
		var delete_row_fx = function(e) 
		{	
			e.preventDefault();
			
			var index = formTable.find('.delete-row').index(this);
			
			var row = formTable.find('.row').get(index);
			settings.preRemoveRow($(row));
			row.remove();
			
			var rowSize = formTable.find('.row').size();
			
			if(rowSize == 0)
				formTable.find('.add-row').click();
			
			formTable.find('.row').removeClass('odd');
			formTable.find('.row').removeClass('even');
			
			formTable.children('.row:odd').addClass('odd');
			formTable.children('.row:even').addClass('even');
			
			formTable.find('.row').each(function(i, elem) {
				
				$(this).find('.position input').val(i+1);
				$(this).find('.position span').text(i+1);
				
				$(this).find(selector.replace(":checked", "")).each(function(j, elem) {
					if($(this).parent().hasClass('checkboxbutton')) 
					{
						var idProperty = $(this).attr('id').split('.')[1];
						var nameProperty = $(this).parent().find('input[type=hidden]').attr('name').split('.')[1];

						$(this).attr('id', settings.path + i + '.' + idProperty);
						$(this).attr('name', settings.path + '[' + i + '].' + nameProperty);
						
						$(this).parent().find('label').css('display', 'block');
						$(this).parent().find('label').attr('for', settings.path + i + '.' + idProperty);
						$(this).parent().find('input[type=hidden]').attr('name', '_' + settings.path + '[' + i + '].' + nameProperty);
					}
					else
					{
						var idProperty = $(this).attr('id').split('.')[1];
						var nameProperty = $(this).attr('id').split('.')[1];
						
						$(this).attr('id', settings.path + i + '.' + idProperty);
						$(this).attr('name', settings.path + '[' + i + '].' + nameProperty);	
					}
				});
			});
		} 
		
		
		/*
		 * Funcion para agregar una fila de datos
		 */
		var add_row_fx = function(e) 
		{	
			e.preventDefault();
			
			var i = formTable.find('.row').size();		
			var row = $('#' + formTable.attr('id') + '_container .row').first().clone();
			
			row.removeClass('odd');
			row.removeClass('even');			
			row.addClass(((i % 2) > 0) ? 'odd' : 'even');
			
			row.find('.position input').val(i+1);
			row.find('.position span').text(i+1);
			
			row.find(selector.replace(":checked", "")).each(function(j, elem) {
				if($(this).parent().hasClass('checkboxbutton')) 
				{
					var idProperty = $(this).attr('id').split('.')[1];
					var nameProperty = $(this).parent().find('input[type=hidden]').attr('name').split('.')[1];

					$(this).attr('id', settings.path + i + '.' + idProperty);
					$(this).attr('name', settings.path + '[' + i + '].' + nameProperty);
					
					$(this).parent().find('label').css('display', 'block');
					$(this).parent().find('label').attr('for', settings.path + i + '.' + idProperty);
					$(this).parent().find('input[type=hidden]').attr('name', '_' + settings.path + '[' + i + '].' + nameProperty);
				}
				else 
				{
					var idProperty = $(this).attr('id').split('.')[1];
					var nameProperty = $(this).attr('id').split('.')[1];
					
					$(this).attr('id', settings.path + i + '.' + idProperty);
					$(this).attr('name', settings.path + '[' + i + '].' + nameProperty);
				}
			});
			
			row.find('.delete-row').each(function(i, elem) {
				$(this).click(delete_row_fx);
			});	
			
			formTable.find('.header, .row').last().after(row);
			
			settings.postAddRow(row, formTable.find('.row').size());
		}
		
		
		/*
		 * Funcion para cargar datos antes de realizar la acción 'enviar'
		 */
		this.on('createJSON', function(event, jsonData) {
			
			$(this).children('.row').find(selector).each(function(i, elem) {
				
				if($(this).get(0).tagName == 'INPUT') 
				{
					if($(this).attr('type') == 'checkbox') 
					{
						jsonData[$(this).attr('name')] = $(this).is(':checked');
					}
					else {						
						jsonData[$(this).attr('name')] = $(this).val();
					}
				}
				else if($(this).get(0).tagName == 'SELECT' && $(this).is('[multiple]')) 
				{
					var selectMultiple = $(this);
					
					selectMultiple.find('option:selected').each(function(j, option) {

						jsonData[selectMultiple.attr('name') + '[' + j + ']'] = $(this).val();
					});
				}
				else
				{
					jsonData[$(this).attr('name')] = $(this).val()
				}
			});	
						
			return jsonData;
		});
		
		
		/*
		 * Tratamiento de rows si es una tabla dinamica 
		 */
		if(settings.dinamicRows) {
			
			var div = $('<div/>', { id: this.attr('id') + '_container', style: 'display: none;' });			
			this.after(div);
			
			if(this.find('.add-row').size() == 0) {
				alert('Debe agregar un boton con clase \"add-row\" para agregar filas a la tabla id=\"' + this.attr('id') + '\".');
				return false;
			}
			if(this.children('.row').size() != this.find('.delete-row').size()) {
				alert('Debe agregar un boton con clase \"delete-row\" a cada fila de la tabla id=\"' + this.attr('id') + '\".');
				return false;
			}
			
			var row = this.children('.row').first().clone();
			div.append(row);
			
			GRAL_limpiarForm(div.attr('id'));
			row.find('span.error').remove();
			row.find('span').text('');
			row.find('input[type=hidden]').val('');
			row.find('option').removeAttr('selected');
			
			this.find('.delete-row').each(function(i, elem) {
				$(this).click(delete_row_fx);
			});	
			
			this.find('.add-row').each(function(i, elem) {
				$(this).click(add_row_fx);
			});
		}

		
		/*
		 * Deteccion de cambio de dimensiones
		 */
		var dimensionScreen = false;
		var dimensionMobile = false;
		
			
		/*
		 * Funcion para cambio de dimensiones
		 */
		this.bind('resize', function() {
			
			var labelSelector = settings.path.replace('\\[', '').replace('\\]', '');
			
			if($(this).find('.row').first().height() < settings.maxHeight) 
			{
				if(!dimensionScreen)
				{
					$(this).find('.header > div').show();
					$(this).find('.header').removeClass('header-mobile');
					$(this).find('label[for^=' + labelSelector + ']').hide();
					$(this).next().find('label[for^=' + labelSelector + ']').hide();
					$(this).find('div.checkboxbutton label').show();
					
					dimensionScreen = true;
					dimensionMobile = false;	
				}
			}
			else 
			{ 	
				if(!dimensionMobile)
				{
					$(this).find('.header > div').hide();
					$(this).find('.header').addClass('header-mobile');
					$(this).find('label[for^=' + labelSelector + ']').css('display', 'block');
					$(this).find('label[for^=' + labelSelector + ']').show();
					$(this).next().find('label[for^=' + labelSelector + ']').css('display', 'block');
					$(this).next().find('label[for^=' + labelSelector + ']').show();
					$(this).find('div.checkboxbutton label').show();
					
					dimensionScreen = false;
					dimensionMobile = true;
				}
			}
		});
		
		this.trigger('resize');
		
		return this;
    };
 
}( jQuery ));