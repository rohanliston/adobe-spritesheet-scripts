/**
 * SpriteSheetSplitter.jsx
 *
 * Splits a grid-based sprite sheet into individual images.
 *
 * @author Rohan Liston
 * @version 1.0
 * @date 14-Feb-2012
 *
 * Feel free to distribute and mangle this script as you like, but please give credit where it is due. 
 * If you find a bug or come up with any cool new features, drop me a line at http://www.rohanliston.com !
 */
 
var numCols, numRows;
var userCancelled = false;
main();

function main()
{
	if (documents.length > 0)
	{
        // Use pixels for all document measurements
        app.preferences.rulerUnits = Units.PIXELS;	
		
        showDialog();
        if(userCancelled)
            return;
            
        app.bringToFront();
		
        if(numCols > 0 && numRows > 0)
            splitSheet();
        else
            alert("Error: Bad input.");
	}
	else
	{  
		alert("Error: There are no open documents.");
	}
}

/** 
 * Splits the sheet up into (numCols*numRows) images
 * and pastes them as separate layers in a new document.
 */
function splitSheet()
{
	var originalDoc = activeDocument; 

	// Calculate number of sub-images and their dimensions
    var numLayers = numCols * numRows;
	var spriteWidth = originalDoc.width / numCols;
	var spriteHeight = originalDoc.height / numRows;   
	var currentRow = 0;
	var currentCol = 0;
	
	// Create a new document
	var newDoc = app.documents.add(spriteWidth, spriteHeight);
	
	// Iterate through the sub-images and copy them into a new document
	// This is done last->first so that no re-ordering of layers has to be done in the new document
	for(i=0; i < numLayers; i++)
	{
		// Bring the original document to the front
		app.activeDocument = originalDoc;
	
		// Work out coordinates of the selection box
		var topLeftX = currentCol * spriteWidth;
		var topLeftY = currentRow * spriteHeight;
		var topRightX = topLeftX + spriteWidth;
		var topRightY = topLeftY;
		var bottomLeftX = topLeftX;
		var bottomLeftY = topLeftY + spriteHeight;
		var bottomRightX = topLeftX + spriteWidth;
		var bottomRightY = bottomLeftY;
		
		var shapeRef = [[topLeftX, topLeftY], 
					   [topRightX, topRightY], 
					   [bottomRightX, bottomRightY], 
					   [bottomLeftX, bottomLeftY]];
		
		// Copy the selection and paste it into the new document
		originalDoc.selection.select(shapeRef);
		originalDoc.selection.copy();
		app.activeDocument = newDoc;
		newDoc.paste();
		
		// Go to the next col/row in the sequence
		currentCol++;
		if(currentCol > numCols-1)
		{
			currentRow++;
			currentCol = 0;
		}
	}
	
	// Remove the background layer in the new document
	newDoc.artLayers["Background"].remove();
}

/**
 * Shows/validates the UI dialog box.
 */
function showDialog()
{
	// Create a new dialog box with a single panel
	var dialog = new Window("dialog", "Sprite Sheet Splitter");
	var sizePanel = dialog.add("panel", [0,0,215,180], "Sprite Sheet Size");

	// Number of columns
	var numColsLabel = sizePanel.add("statictext", [25,25,150,35], "Number of columns:");
	var numColsText = sizePanel.add("edittext", [145,24,185,43], 4);

	// Number of rows
	var numRowsLabel = sizePanel.add("statictext", [25,55,150,65], "Number of rows:");
	var numRowsText = sizePanel.add("edittext", [145,54,185,73], 4);
	numRowsLabel.enabled = false;
	numRowsText.enabled = false;

	// Checkbox for making the number of cols/rows the same
	var equalRowsLabel = sizePanel.add("statictext", [25,85,150,95], "Equal cols/rows:");
	var equalRowsBox = sizePanel.add("checkbox", [145,85,175,105]);
	equalRowsBox.value = true;

	// When the checkbox is clicked, enable/disable the second input box
	equalRowsBox.onClick = function()
	{
		numRowsLabel.enabled = !numRowsLabel.enabled; 
		numRowsText.enabled = !numRowsText.enabled; 
		
		if(equalRowsBox.value == true)
			numRowsText.text = numColsText.text;
	}

	// Make the number of rows match the number of columns if necessary
	numColsText.onChanging = function()
	{
		if(equalRowsBox.value == true)
			numRowsText.text = numColsText.text; 
	}

	// Buttons for OK/Cancel
	var okButton = sizePanel.add("button", [25,125,100,150], "OK", {name:'ok'});
	var cancelButton = sizePanel.add("button", [110,125,185,150], "Cancel", {name:'cancel'});

	// Event handler for OK button
	okButton.onClick = function()
	{
		numCols = parseInt(numColsText.text);
		numRows = parseInt(numRowsText.text);
		dialog.close(0);
	}

	// Event handler for Cancel button
	cancelButton.onClick = function()
	{
		dialog.close();
		userCancelled = true;
	}

	dialog.center();
	dialog.show();
}