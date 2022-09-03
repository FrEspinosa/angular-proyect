/**
 * @autor Gaston Mancini
 * 
 * Customizacion dataTable bootstrap por falencias en tablas de input
 */


/***********************************************************************************************
 * 
 * 								RENDER FUNCTIONS
 * 
 ***********************************************************************************************/

function _initCustomDataTable(dt, settings, data) {
	
	/* 
	 * create div to contain data 
	 */
	
	var tempDiv = $('<div>');
	
	tempDiv
		.attr('id', "TMP_" + $(dt.table().body()).parent().attr('id'))
		.css('display', 'none');
	
	$('form').first().before(tempDiv);
	
	
	/* 
	 * init each data of table 
	 */
	
	$(dt.table().body()).find('input[type="text"], input[type="checkbox"], input[type="radio"], select').each(
		function() {
			tempDiv.append(
				$(this).clone()
					.attr('id', 'TMP_' + $(this).attr('id'))
					.attr('name', 'TMP_' + $(this).attr('name'))
			);
		}		
	);
	$.each(data.columnsDefinition, function(index, columnData) {
		
		if(columnData.type == 'readonly') {
			
			$("#" + settings.sTableId + " tbody > tr").each(function(index2, row) {
				
				var tempCell = $(this).children().eq(index);
				
				$("#" + settings.sTableId + "_wrapper").before(
					$('<input>')
						.attr('id', data.model + index2 + '.' + columnData.name)
						.attr('name', data.model +  '[' + index2 + '].' + columnData.name)
						.attr('type', 'hidden')
						.val(tempCell.text().trim())
				);
				
				tempDiv.append(
					$('<input>')
						.attr('id', 'TMP_' + data.model + index2 + '.' + columnData.name)
						.attr('name', 'TMP_' + data.model +  '[' + index2 + '].' + columnData.name)
						.attr('type', 'hidden')
						.val(tempCell.text().trim())
				);
			});
		}
	});
	if (typeof data.hiddenDefinition != 'undefined')
		
		$.each(data.hiddenDefinition, function(index, hiddenData) {
			
			$("#" + settings.sTableId + " tbody > tr").each(function(index2, row) {
				
				$("#" + settings.sTableId + "_wrapper").before($(data.model + index2 + '\\.' + hiddenData.name));
			});
		});
	
	
	/* 
	 * Attach events each input data of a table 
	 */
	
	$(dt.table().body()).find('input[type="text"]').each(
		function() {
			$(this).keyup(function() {
				$('#TMP_' + $(this).attr('id').replace('.', '\\.')).val($(this).val());
			});
		}		
	);
	$(dt.table().body()).find('input[type="checkbox"]').each(
		function() {
			$(this).click(function() {
				$('#TMP_' + $(this).attr('id').replace('.', '\\.')).prop('checked', $(this).is(':checked'));
			});
		}		
	);
	$(dt.table().body()).find('input[type="radio"]').each(
		function() {
			alert('Avisar a Gaston Mancini. Inputs radio sobre tablas no esta implementado');
		}		
	);
	$(dt.table().body()).find('select').each(
		function() {
			$(this).change(function() {
				$('#TMP_' + $(this).attr('id').replace('.', '\\.')).val($(this).val());
			});
		}		
	);
	
}


function _initDropDownDataTable(settings, row) {
	
	$(row.node()).next().find('input[type="text"]').each(
		function() {		
			$(this).val($('#TMP_' + $(this).attr('id').replace('.', '\\.')).val());
			
			$(this).keyup(function() {
				$('#TMP_' + $(this).attr('id').replace('.', '\\.')).val($(this).val());
			});
		}
	);
	$(row.node()).next().find('input[type="checkbox"]').each(
		function() {		
			$(this).prop('checked', $('#TMP_' + $(this).attr('id').replace('.', '\\.')).is(':checked'));
			
			$(this).click(function() {
				$('#TMP_' + $(this).attr('id').replace('.', '\\.')).prop('checked', $(this).is(':checked'));
			});
		}
	);
	$(row.node()).next().find('select').each(
		function() {		
			$(this).val($('#TMP_' + $(this).attr('id').replace('.', '\\.')).val());
			
			$(this).change(function() {
				$('#TMP_' + $(this).attr('id').replace('.', '\\.')).val($(this).val());
			});
		}
	);
	$(row.node()).next().find('a.deleteButton').each(function () {

		$(this).on('deleteAction', _deleteRow);
		
		$(this).click(function() {
			$(this).trigger('deleteAction', [ settings, null ]);
		});
	});
	
	setRowInputMasks($(row.node()).next());
}


function _refreshRowDataTable(tr) {
	
	$(tr).find('input[type="text"]').each(
		function() {		
			$(this).val($('#TMP_' + $(this).attr('id').replace('.', '\\.')).val());
		}
	);
	$(tr).find('input[type="checkbox"]').each(
		function() {		
			$(this).prop('checked', $('#TMP_' + $(this).attr('id').replace('.', '\\.')).is(':checked'));
		}
	);
	$(tr).find('select').each(
		function() {		
			$(this).val($('#TMP_' + $(this).attr('id').replace('.', '\\.')).val());
		}
	);
}


/***********************************************************************************************
 * 
 * 								DINAMIC FUNCTIONS
 * 
 ***********************************************************************************************/

function _initFeatureDinamicTable( dt, settings, data ) {
	
	try 
	{
		_validateDinamicData(settings, data);
				
		_initColumnDefinitionData(settings, data);
		
		_initDinamicData(dt, settings, data);
		
		_initAddButton(settings, data);
		
		_atachDataToPost(settings, data);
	}
	catch(e)
	{
		alert(e);
		throw e;
	}
}


function _validateDinamicData(settings, data) {
	
	var types = [
	     "row-index",
	     "readonly",
         "text",
         "date",
         "numeric",
         "checkbox",
         "radio",
         "select",
         "deleteButton"
     ];
	
	if (typeof data.model == 'undefined' || data.model == "") 
		throw "Need \"model\" data to bind object";
	
	if (typeof data.addButton == 'undefined' || data.addButton == "") 
		throw "Need \"addButton\" data to add rows dynamically";
	
	if (typeof data.columnsDefinition == 'undefined' || data.columnsDefinition.length == 0) 
		throw "Need \"columnsDefinition\" data to define type of columns";
	
	if($(data.addButton).size() == 0)
		throw "No \"addButton\" found in the DOM";
	else if($(data.addButton).size() > 1)
		throw "Input \"addButton\" found more than once in the DOM";
		
	if(data.columnsDefinition.length != $("#"+ settings.sTableId + " th").size())
		throw "Missing \"columnsDefinition\" data found: " + data.columnsDefinition.length + " expected: " + $("#"+ settings.sTableId + " th").size();
	
	$.each(data.columnsDefinition, function(index, columnData) {
		
		if (typeof columnData.name == 'undefined' || columnData.name == "")
			if($.inArray(columnData.type, ['row-index', 'deleteButton']) < 0)
				throw "Need \"name\" in column definition at index: " + index;
		
		if (typeof columnData.type == 'undefined' || columnData.type == "") 
			throw "Need \"type\" in column definition at index: " + index;
		else if (columnData.type == 'radio') 
			throw "\"type\" radio is not implemented in dinamic table at index: " + index;
		else if($.inArray(columnData.type, types) < 0)
			throw "data \"type\" not valid at index: " + index;
		
		if(columnData.type == 'select') {		
			if (typeof columnData.options == 'undefined' || columnData.options.length == 0) 
				throw "Need \"options\" in column definition at index: " + index;
						
			$.each(columnData.options, function(index2, optionData) {			
				if (typeof optionData.key == 'undefined') 
					throw "Need \"key\" in options, column definition at index: " + index;
				
				if (typeof optionData.value == 'undefined' || optionData.value == "") 
					throw "Need \"value\" in options, column definition at index: " + index;
			});
		}
		else if(columnData.type == 'deleteButton') {
			
			if (typeof columnData.startWith == 'undefined' || columnData.startWith == "") 
				throw "Need \"startWith\" in column definition at index: " + index;
		}
	});
	
	var deleteButton = false;
	
	$.each(data.columnsDefinition, function(index, columnData) {
		if(columnData.type == 'deleteButton') {
			deleteButton = true;
		}
	});
	
	if(!deleteButton)
		throw "Need \"deleteButton\" data to remove rows dynamically";
	
	if($("#" + settings.sTableId + " tbody > tr").size() > 0)
		if($("#" + settings.sTableId + " tbody > tr a.deleteButton").size() ==0)
			throw "Anchor to \"deleteButton\" has no class \"deleteButton\" in de DOM";
}


/***********************************************************************************************
 * 
 * 								STATIC FUNCTIONS
 * 
 ***********************************************************************************************/

function _initFeatureStaticTable( dt, settings, data ) {
	
	try 
	{
		_validateStaticData(settings, data);
		
		_initCustomDataTable(dt, settings, data);
				
		_atachDataToPost(settings, data);
	}
	catch(e)
	{
		alert(e);
		throw e;
	}
}


function _validateStaticData(settings, data) {
	
	var types = [
	     "readonly",
         "text",
         "date",
         "numeric",
         "checkbox",
         "radio",
         "select"
     ];
	
	if (typeof data.model == 'undefined' || data.model == "") 
		throw "Need \"model\" data to bind object";
		
	if (typeof data.columnsDefinition == 'undefined' || data.columnsDefinition.length == 0) 
		throw "Need \"columnsDefinition\" data to define type of columns";
			
	if(data.columnsDefinition.length != $("#"+ settings.sTableId + " th").size())
		throw "Missing \"columnsDefinition\" data found: " + data.columnsDefinition.length + " expected: " + $("#"+ settings.sTableId + " th").size();
	
	$.each(data.columnsDefinition, function(index, columnData) {
		
		if (typeof columnData.name == 'undefined' || columnData.name == "")
				throw "Need \"name\" in column definition at index: " + index;
		
		if (typeof columnData.type == 'undefined' || columnData.type == "") 
			throw "Need \"type\" in column definition at index: " + index;
		else if (columnData.type == 'radio') 
			throw "\"type\" radio is not implemented in dinamic table at index: " + index;
		else if($.inArray(columnData.type, types) < 0)
			throw "data \"type\" not valid at index: " + index;
		
		if(columnData.type == 'select') {		
			if (typeof columnData.options == 'undefined' || columnData.options.length == 0) 
				throw "Need \"options\" in column definition at index: " + index;
						
			$.each(columnData.options, function(index2, optionData) {			
				if (typeof optionData.key == 'undefined') 
					throw "Need \"key\" in options, column definition at index: " + index;
				
				if (typeof optionData.value == 'undefined' || optionData.value == "") 
					throw "Need \"value\" in options, column definition at index: " + index;
			});
		}
	});
}


function _initColumnDefinitionData(settings, data) {
	
	/* 
	 * create div to contain row data 
	 */
	
	var tempDiv = $('<div>');
	
	tempDiv
		.attr('id', "TMP_ROW_" + settings.sTableId)
		.css('display', 'none')
		.append(
			$('<input>')
				.attr('type', 'hidden')
				.addClass('row-index')
				.val('0')
		);
	
	$('form').first().before(tempDiv);
		
	var tempRow = $('<tr>').attr('role', 'row');
	
	$.each(data.columnsDefinition, function(index, columnData) {
		
		var tempCell = $('<td>');
			
		if(columnData.type == 'row-index') 
		{	
			tempCell
				.addClass('row-index')
				.addClass('text-center');
		}
		else if(columnData.type == 'readonly') 
		{	
			tempCell
				.text('');
		}
		else if(columnData.type == 'text') 
		{	
			tempCell
				.append(
					$('<div>')	
						.addClass('input-group-btn')
						.append(
							$('<input>')
								.attr('id', data.model +  'INDEX.' + columnData.name)
								.attr('name', data.model +  '[INDEX].' + columnData.name)
								.attr('type', 'text')
								.addClass('form-control')
						)
				);
		}
		else if(columnData.type == 'date') 
		{	
			tempCell
				.append(
					$('<div>')	
						.addClass('input-group-btn')
						.append(
							$('<input>')
								.attr('id', data.model +  'INDEX.' + columnData.name)
								.attr('name', data.model +  '[INDEX].' + columnData.name)
								.attr('type', 'text')
								.addClass('form-control')
								.addClass('date')
						)
				);
		}
		else if(columnData.type == 'numeric') 
		{	
			tempCell
				.append(
					$('<div>')	
						.addClass('input-group-btn')
						.append(
							$('<input>')
								.attr('id', data.model +  'INDEX.' + columnData.name)
								.attr('name', data.model +  '[INDEX].' + columnData.name)
								.attr('type', 'text')
								.addClass('form-control')
								.addClass('numeric')
						)
				);
		}
		else if(columnData.type == 'checkbox') 
		{	
			tempCell
				.append(
					$('<div>')	
						.addClass('input-group-btn')
						.addClass('text-center')
						.append(
							$('<div>')
								.addClass('checkboxbutton')
								.append(
									$('<input>')
										.attr('id', data.model +  'INDEX.' + columnData.name)
										.attr('name', data.model +  '[INDEX].' + columnData.name)
										.attr('type', 'checkbox')
										.val('true')
								)
								.append(
									$('<label>')
										.attr('for', data.model +  'INDEX.' + columnData.name)
								)
								.append(
									$('<input>')
										.attr('name', "_" + data.model +  '[INDEX].' + columnData.name)
										.attr('type', 'hidden')
										.val('on')
								)
						)
				);
		}
		else if(columnData.type == 'select') 
		{	
			var tempSelect = 
					$('<select>')
						.attr('id', data.model +  'INDEX.' + columnData.name)
						.attr('name', data.model +  '[INDEX].' + columnData.name)
						.addClass('form-control');
			
			$.each(columnData.options, function(i, item) {
				tempSelect.append($('<option>', { 
			        value: item.key,
			        text : item.value 
			    }));
			});
			
			tempCell
				.append(
					$('<div>')	
						.addClass('input-group-btn')
						.append(tempSelect)
				);
		}
		else if(columnData.type == 'deleteButton') 
		{	
			tempCell
				.append(
					$('<span>')	
						.addClass('input-group-btn')
						.append(
							$('<a>')
								.attr('id', columnData.startWith.replace('#', '') + 'INDEX')
								.addClass('deleteButton')
								.addClass('btn')
								.addClass('btn-danger')
								.append(
									$('<i>')
										.addClass('fa')
										.addClass('fa-trash')
								)
								.append('&nbsp;')
								.append('Eliminar')
						)
				);
		}

		tempRow.append(tempCell);
	});
	
	tempDiv.append(tempRow);
}


function _initDinamicData(dt, settings, data) {
	
	// Init basic data
	_initCustomDataTable(dt, settings, data);
	
	$.each(data.columnsDefinition, function(index, columnData) {
		
		if(columnData.type == 'row-index') {
			
			$("#" + settings.sTableId + " tbody > tr").each(function(index2, row) {
				
				var tempCell = $(this).children().eq(index);
				
				tempCell
					.addClass('row-index')
					.addClass('text-center')
					.text(index2 + 1);
			});
		}
		else if(columnData.type == 'deleteButton') {
			
			$("#" + settings.sTableId + " tbody > tr").each(function(index2, row) {
				
				var tempCell = $(this).children().eq(index);
				
				var tempSpan = tempCell.children('span');			
				tempSpan.addClass('input-group-btn');
				
				tempAnchor = tempSpan.children('a');
				tempAnchor
					.addClass('deleteButton')
					.addClass('btn')
					.addClass('btn-danger')
					.attr('row', index2)
					.html('');
				
				tempAnchor
					.append(
						$('<i>')
							.addClass('fa')
							.addClass('fa-trash')
					)
					.append('&nbsp;')
					.append('Eliminar');
				
				tempAnchor.on('deleteAction', _deleteRow);
				
				tempAnchor
					.click(function() {
						$(this).trigger('deleteAction', [ settings, null ]);
					});
			});
		}
	});	

	
	/*
	 * Update INDEX
	 */
	
	var rowCount = $("#" + settings.sTableId + " tbody > tr").not('.child').size();
	
	$("#TMP_ROW_" + settings.sTableId + " .row-index").val(rowCount);
}


function _initAddButton(settings, data) {
	
	/*
	 * Copy Rows Dinamically on click event
	 */
	$(data.addButton).click(function() {
		
		/*
		 * Visual ROW
		 */
		var index = parseInt($("#TMP_ROW_" + settings.sTableId + " .row-index").val());
		var newRow = $("#TMP_ROW_" + settings.sTableId + " tr").clone();
		
		if((index % 2) == 0)
			newRow.addClass('odd');
		else
			newRow.addClass('even');
		
		newRow.find('td.row-index').each(function () {
			$(this)
				.text(index + 1);
		});
		
		newRow.find('input[type="text"], select').each(function () {
			$(this)
				.attr('id', $(this).attr('id').replace('INDEX', index))
				.attr('name', $(this).attr('name').replace('INDEX', index));
		});
		newRow.find('input[type="checkbox"]').each(function () {
			$(this)
				.attr('id', $(this).attr('id').replace('INDEX', index) + '1')
				.attr('name', $(this).attr('name').replace('INDEX', index));
		});
	
		newRow.find('div.checkboxbutton label').each(function () {
			$(this)
				.attr('for', $(this).attr('for').replace('INDEX', index) + '1');
		});
		
		newRow.find('div.checkboxbutton input[type="hidden"]').each(function () {
			$(this)
				.attr('name', $(this).attr('name').replace('INDEX', index));
		});
		
		newRow.find('a.deleteButton').each(function () {
			$(this)
				.attr('id', $(this).attr('id').replace('INDEX', index))
				.attr('row', index);
			
			$(this).on('deleteAction', _deleteRow);
			
			$(this).click(function() {
				$(this).trigger('deleteAction', [ settings, null ]);
			});
		});
		
		$("#" + settings.sTableId + " tbody").append(newRow);
		
		setRowInputMasks(newRow);
		
		
		/*
		 * ADD TMP_ROW
		 */
		var tempRow = $("#TMP_ROW_" + settings.sTableId + " tr").clone();
		
		tempRow.find('input[type="text"], input[type="checkbox"], select').each(function () {
			
			if($(this).attr('type') == 'checkbox') {
				$(this)
					.attr('id', 'TMP_' + $(this).attr('id').replace('INDEX', index) + '1')
					.attr('name', 'TMP_' + $(this).attr('name').replace('INDEX', index));
			}
			else {
				$(this)
					.attr('id', 'TMP_' + $(this).attr('id').replace('INDEX', index))
					.attr('name', 'TMP_' + $(this).attr('name').replace('INDEX', index));
			}
			
			$("#TMP_" + settings.sTableId).append($(this));
		});
		
		
		/*
		 * EVENTS NEW ROW
		 */
		newRow.find('input[type="text"]').each(
			function() {		
				$(this).keyup(function() {
					$('#TMP_' + $(this).attr('id').replace('.', '\\.')).val($(this).val());
				});
			}
		);
		newRow.find('input[type="checkbox"]').each(
			function() {		
				$(this).click(function() {
					$('#TMP_' + $(this).attr('id').replace('.', '\\.')).prop('checked', $(this).is(':checked'));
				});
			}
		);
		newRow.find('select').each(
			function() {		
				$(this).change(function() {
					$('#TMP_' + $(this).attr('id').replace('.', '\\.')).val($(this).val());
				});
			}
		);
			
		
		/*
		 * Update INDEX
		 */
		$("#TMP_ROW_" + settings.sTableId + " .row-index").val(index + 1);
		
		settings.oApi._fnAddTr( settings, newRow );
		
		settings.responsive._resize();
		
	});
}


function _deleteRow(event, settings, rowData) {
	
	var row = null;
	var rowChild = null;
	var rowIndex = parseInt($(this).attr('row'));
	var elem = $(this).parent().parent();
	var dinamicTable = settings.oFeatures.dinamicTable;
	var model = dinamicTable.model;
	
	
	if(elem.hasClass('dtr-data')) {
		rowChild = elem.parent().parent().parent().parent();	
		row = rowChild.prev();
	}
	else {
		row = elem.parent();
	}
	
	row.find('input[type="text"], input[type="checkbox"], input[type="radio"], select').each(
		function() {
			$('#TMP_' + $(this).attr('id').replace('.', '\\.')).remove();
		}		
	);
	
	if(rowChild != null) {
		rowChild.find('input[type="text"], input[type="checkbox"], input[type="radio"], select').each(
			function() {
				$('#TMP_' + $(this).attr('id').replace('.', '\\.')).remove();
			}		
		);
		
		rowChild.remove();
	}
	
	$.each(dinamicTable.columnsDefinition, function(index, columnData) {
		
		if(columnData.type == 'readonly') {
			
			$('#' + model + rowIndex + '\\.' + columnData.name).remove();
			$('#TMP_' + model + rowIndex + '\\.' + columnData.name).remove();
		}
	});
	
	if (typeof dinamicTable.hiddenDefinition != 'undefined')
		
		$.each(dinamicTable.hiddenDefinition, function(index, hiddenData) {
			
			$('#' + model + rowIndex + '\\.' + hiddenData.name).remove();
		});
	
	
	/*
	*	Delete row
	*/
	row.remove();
	
	/*
	 * Refresh prevs inputs
	 */
	
	var rowTotal = $("#" + settings.sTableId + " tbody > tr").not('.child').size();
	
	while( rowIndex < rowTotal ) {
		
		$.each(dinamicTable.columnsDefinition, function(index, columnData) {
			
			if(typeof columnData.name != 'undefined') {
			
				if(columnData.type == 'checkbox') {
				
					$('#' + model + (rowIndex + 1) + '\\.' + columnData.name + '1')
						.attr('id', model + (rowIndex) + '\.' + columnData.name + '1')
						.attr('name', model + '[' + rowIndex + ']\.' + columnData.name);
					
					$('label[for=' + model + (rowIndex + 1) + '\\.' + columnData.name + '1]')
						.attr('for', model + (rowIndex) + '\.' + columnData.name + '1');
					
					$('input[type="hidden"][name="_' + model + '[' + (rowIndex + 1) + ']\\.' + columnData.name +'"]')
						.attr('name', '_' + model + '[' + (rowIndex) + ']\\.' + columnData.name);
					
					$('#TMP_' + model + (rowIndex + 1) + '\\.' + columnData.name + '1')
						.attr('id', 'TMP_' + model + (rowIndex) + '\.' + columnData.name + '1')
						.attr('name', 'TMP_' + model + '[' + rowIndex + ']\.' + columnData.name);
				}
				else {
					
					$('#' + model + (rowIndex + 1) + '\\.' + columnData.name)
						.attr('id', model + (rowIndex) + '\.' + columnData.name)
						.attr('name', model + '[' + rowIndex + ']\.' + columnData.name);
					
					$('#TMP_' + model + (rowIndex + 1) + '\\.' + columnData.name)
						.attr('id', 'TMP_' + model + (rowIndex) + '\.' + columnData.name)
						.attr('name', 'TMP_' + model + '[' + rowIndex + ']\.' + columnData.name);
				}	
			}
			else if(columnData.type == 'deleteButton') {
				
				$(columnData.startWith + (rowIndex + 1))		
					.attr('id',  columnData.startWith + rowIndex)
					.attr('row', rowIndex);
			}
		});
		if (typeof dinamicTable.hiddenDefinition != 'undefined')
			
			$.each(dinamicTable.hiddenDefinition, function(index, hiddenData) {
				
				$('#' + model + (rowIndex + 1) + '\\.' + hiddenData.name)
					.attr('id', model + (rowIndex) + '\.' + hiddenData.name)
					.attr('name', model + '[' + rowIndex + ']\.' + hiddenData.name);
			});
		
		/*
		 * Replace intern jquery.datatable DATA
		 */
		
		var aoData = settings.aoData[rowIndex];
		var aoData2 = settings.aoData[rowIndex + 1];
		
		aoData._aFilterData = aoData2._aFilterData;
		aoData._aSortData = aoData2._aSortData;
		aoData._details = aoData2._details;
		aoData._detailsShow = aoData2._detailsShow;
		aoData._sFilterRow = aoData2._sFilterRow;
		aoData._sRowStripe = aoData2._sRowStripe;
		aoData.anCells = aoData2.anCells;
		aoData.nTr = aoData2.nTr;
		aoData.src = aoData2.src;
		
		aoData.nTr._DT_RowIndex = rowIndex;
		
		rowIndex = rowIndex + 1;
	}
	
	/*
	 * Remove internal jquery.datatable DATA
	 */
	
	settings.aoData[rowIndex] = null;
	settings.aoData = jQuery.grep(settings.aoData, function(item) {
		return item != null;
	});
	
	settings.aiDisplay[rowIndex] = null;
	settings.aiDisplay = jQuery.grep(settings.aiDisplay, function(item) {
		return item != null;
	});
	
	settings.aiDisplayMaster[rowIndex] = null;
	settings.aiDisplayMaster = jQuery.grep(settings.aiDisplayMaster, function(item) {
		return item != null;
	});

	
	/*
	 * Update INDEX
	 */

	_recalculateRows(settings);
		
	$("#TMP_ROW_" + settings.sTableId + " .row-index").val(rowTotal);
}


function _recalculateRows(settings) {
	
	rowClass = [ 'odd', 'even' ];
	
	$("#" + settings.sTableId + " tbody > tr").not('.child').each(function(index, row){
		
		$(this).find('.row-index').text(index + 1);
		
		$(this)
			.removeClass('odd')
			.removeClass('even')
			.addClass(rowClass[index % 2]);
	});
}


function _atachDataToPost(settings, data) {
	
	$("#" + settings.sTableId).on('openChilds', function(event, settings, data) {
		
		$("#" + settings.sTableId + " tbody > tr").not('.child').not('.parent').each(function(index, row){
			
			$(this).children().first().click();
		});
	});
	
	$(document).bind('beforeSubmit', function() {
		$("#" + settings.sTableId).trigger('openChilds', [ settings, data ]);
	});
	
	
	$("#" + settings.sTableId).on('createJSON', function(event, jsonData) {
		
		jQuery.event.trigger('beforeSubmit');
		
		var rowIndex = 0;
		var rowTotal = $("#" + settings.sTableId + " tbody > tr").not('.child').size();
				
		while(rowIndex < rowTotal) {
			
			_createJSON(rowIndex, data, jsonData);
			
			rowIndex = rowIndex + 1;
		}
		
		return jsonData;
	});
}


function _createJSON(rowIndex, data, jsonData) {

	$.each(data.columnsDefinition, function(index, columnData) {
		
		if(typeof columnData.name != 'undefined') {
			
			if(columnData.type == 'checkbox') {		
				jsonData[data.model + '[' + rowIndex + '].' +columnData.name] = $('#' + data.model + rowIndex + '\\.' + columnData.name + '1').is(':checked');
			}
			else {		
				jsonData[data.model + '[' + rowIndex + '].' +columnData.name] = $('#' + data.model + rowIndex + '\\.' + columnData.name).val();
			}	
		}
	});
	
	if (typeof data.hiddenDefinition != 'undefined')
		
		$.each(data.hiddenDefinition, function(index, hiddenData) {
			
			jsonData[data.model + '[' + rowIndex + '].' + hiddenData.name] = $('#' + data.model + rowIndex + '\\.' + hiddenData.name).val();
		});
}

