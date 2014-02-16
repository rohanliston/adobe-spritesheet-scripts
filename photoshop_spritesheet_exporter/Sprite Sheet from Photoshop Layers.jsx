/**
 * MakeSpriteSheet_Photoshop.jsx
 * 
 * Intended for UDK/UE3 content creators, this script enables the user to import a set of image files into 
 * Photoshop and have them automatically arranged into a grid-like sprite sheet. The user is also given 
 * the option of automatically resizing and saving the sprite sheet in multiple different sizes/resolutions.
 *
 * @author Rohan Liston
 * @version 1.0
 * @date 14-Feb-2012
 *
 * Feel free to distribute and mangle this script as you like, but please give credit where it is due. 
 * If you find a bug or come up with any cool new features, drop me a line at http://www.rohanliston.com !
 */

#target photoshop
#script "Make Sprite Sheet"

var acceptableSheetSizes = [2048, 1024, 512, 256, 128, 64];     // List of acceptable square sheet sizes (in pixels)

// Note: any values assigned to the variables below will appear in the showDialog() box by default. 
var spriteSheetDoc;                 // The document that will contain the sprite sheet
var userCancelled = false;          // Whether the user has cancelled from any of the dialog boxes
var numCols = 4, numRows = 4;       // Number of rows/columns in the sheet 
var sheetSizes = [2048, 1024];      // Array of sheet sizes we wish to export 
var autoSave = true;                // Whether we want to resize and save the sheet automatically 
var fileFormat = "PNG";             // Which file format we wish to export as
var bitDepth = "32";                // Bit depth (ie. 24 or 32-bit)
var exportFolder;                   // Where the document will be saved
var sheetFilename = "T_Untitled";   // Export filename for the sprite sheet

/**
 * Extension of Array prototype - Array.contains(obj)
 */
Array.prototype.contains = function(obj) 
{
    var i = this.length;
    while(i--) 
    {
        if(this[i] == obj)
            return true;
    }
    return false;
}

main();

function main()
{
    try
    {
        // Prompt the user for a list of files to import to layers
        if(confirm("Do you wish to import image files into the layer stack now? Choose No if you have already imported images into the layer stack."))
        {
            importFiles();
        }
        else
        {
            if(app.documents.length == 0)
                throw Error("Please create or open a document first.");
            
            spriteSheetDoc = app.activeDocument;
        }
    
        if(spriteSheetDoc.artLayers.length <= 1)
            throw Error("Not enough layers to make a sprite sheet.");
        
        // If the user's settings are valid, make the sprite sheet
        getValidSettings();
        makeSpriteSheet(); 
        
        if(autoSave)
            saveFiles();
        
    }
    catch(e)
    {
        if(e.toString() != "exit")
            alert(e.toString());
    }
}

/**
 * Continually shows the user settings dialog until the user has input valid data or cancelled.
 */
function getValidSettings()
{
    // Show the sprite sheet settings dialog
    showDialog();
    if(userCancelled)
        throw "exit";
    
    if(!validateSheet())
        getValidSettings();
}


/**
 * Prompts the user for a list of files to import.
 */
function importFiles()
{
    // Open the file select dialog
    var fileList = File.openDialog("Select the images you wish to convert into a sprite sheet.", "Image files:*.psd;*.bmp;*.jpg;*.jpeg;*.jpe;*.png;*.tga;*.tif;*.tiff", true);
   
    if(fileList != null)
    {   
        // Create a new document with the same dimensions as the first image in the sequence
        var tempDoc = app.open(fileList[0]);
        spriteSheetDoc = app.documents.add(tempDoc.width, tempDoc.height);
        tempDoc.close();
        
        // Import each image into the new sprite sheet document
        for(i=0; i < fileList.length; i++)
        {
            tempDoc = app.open(fileList[i]);
            tempDoc.selection.selectAll();
            tempDoc.selection.copy();
            app.activeDocument = spriteSheetDoc;
            spriteSheetDoc.paste();
            tempDoc.close();
        }
    
        // Get rid of the background layer
        spriteSheetDoc.artLayers["Background"].remove();
    }
    else
    {
        throw "exit";   // User cancelled
    }
}

/**
 * Checks whether the resulting sheet will be square and a power of two (eg. 1024x1024)
 */
function validateSheet()
{
    var finalWidth = numCols * spriteSheetDoc.width;
    var finalHeight = numRows * spriteSheetDoc.height;
    var squareSheet = finalWidth == finalHeight;
    var powerOfTwo = acceptableSheetSizes.contains(Math.sqrt(finalWidth * finalHeight));
    
    // Make sure the sheet has an appropriate name
    if(autoSave == true && (sheetFilename == "" || sheetFilename == "T_Untitled"))
    {
        alert("Please give the sprite sheet an acceptable name.");
        return false;
    }

    // Make sure the layer count matches the number of frames in the sheet
    if(numCols*numRows != spriteSheetDoc.artLayers.length)
    {
        alert("The number of frames in the document (" + spriteSheetDoc.artLayers.length + ") does not match the number of frames in the desired sprite sheet (" + numCols*numRows + ").");
        return false;
    }

    // Only warn if not square AND not a power of two - if it's square we can just resize it
    if(!squareSheet && !powerOfTwo)
    {
        if(!confirm("WARNING: Resulting sheet size will be " + finalWidth + " by " + finalHeight + ", which is not optimal for UE3/UDK. If you proceed, your sprite sheet will not be auto-saved. Proceed?"))
            throw "exit";
        else 
            autoSave = false;
    }

    return true;
}

/**
 * Arranges the document layers into a sprite sheet.
 */
function makeSpriteSheet()
{
    // Get the document/frame properties
    var activeLayer = spriteSheetDoc.activeLayer;
    var numLayers = spriteSheetDoc.artLayers.length;   
    var spriteSizeX = spriteSheetDoc.width;
    var spriteSizeY = spriteSheetDoc.height;   

    // Resize the canvas
    spriteSheetDoc.resizeCanvas(spriteSizeX*numCols, spriteSizeY*numRows, AnchorPosition.TOPLEFT );

    var currentRow = 0;
    var currentCol = 0;

    // Move each layer into the correct spot
    for(i=numLayers-1; i>=0; i--)
    {    
        spriteSheetDoc.artLayers[i].visible = 1;
        spriteSheetDoc.artLayers[i].translate(spriteSizeX*currentCol, spriteSizeY*currentRow);

        currentCol++;
        if(currentCol > numCols-1)
        {
            currentRow++;
            currentCol = 0;
        }
    }

    // Merge everything together
    spriteSheetDoc.mergeVisibleLayers();
}

/**
 * Saves the files in whatever sizes were specified in the After Effects dialog.
 */
function saveFiles()
{
    app.activeDocument = spriteSheetDoc;
    
    exportFolder = Folder.selectDialog("Choose the folder in which you wish to save the sprite sheet.")
    if(exportFolder == null)
        throw "exit";   // User cancelled
        
    for(i=0; i < sheetSizes.length; i++)
    {
        saveFile(parseInt(sheetSizes[i]));
    }
}

/**
 * Saves the document with the (square) dimensions specified. 
 * @param size - The size of the image in pixels (eg. 2048, 1024, etc)
 */
function saveFile(size)
{
    // Save the current state so we can revert back after resizing/saving
    var savedState = spriteSheetDoc.activeHistoryState;    
    var sheetFile = new File(exportFolder + "/" + sheetFilename + "_" + size);
    var saveOptions;
    
    // Set the file save options
    if(fileFormat == "PNG")
    {
        saveOptions = new PNGSaveOptions();  
        saveOptions.interlaced = false;
    }
    else
    {
        saveOptions = new TargaSaveOptions();
        saveOptions.resolution = bitDepth == "32" ? TargaBitsPerPixels.THIRTYTWO : TargaBitsPerPixels.TWENTYFOUR;
        saveOptions.alphaChannels = bitDepth == "32" ? true : false;
        saveOptions.rleCompression = true;
    }
 
    // Resize, save, then revert back to original state
    spriteSheetDoc.resizeImage(size, size);
    spriteSheetDoc.saveAs(sheetFile, saveOptions, true, Extension.LOWERCASE);
    spriteSheetDoc.activeHistoryState = savedState;
}

/**
 * Shows a dialog box with various sprite sheet options for the user to select
 */
function showDialog()
{
    var dialog = new Window("dialog {text:'Make Sprite Sheet', alignChildren:['fill','center']}");
    
    var filenameOptions = dialog.add("panel {text:'Sheet Name', alignChildren:'left', orientation:'row', margins:[15,15,15,15]}");
    var filenameGroup = filenameOptions.add("group {alignChildren:'left', orientation:'row'}");
    var filenameLabel = filenameGroup.add("statictext {text:'Name:'}");    
    var filenameText = filenameGroup.add("edittext {text:'" + sheetFilename + "', characters:20}");
    
    var sheetOptions = dialog.add("panel {text:'Sprite Sheet Options', alignChildren:'left', orientation:'row', margins:[15,15,15,15]}");
    
    var rowsColsGroup = sheetOptions.add("group {alignChildren:'left', orientation:'column'}");
    
    var colsGroup = rowsColsGroup.add("group");
    var numColsText = colsGroup.add("edittext {text:'" + numCols + "', characters:3}");
    var numColsLabel = colsGroup.add("statictext {text:'Columns'}");

    var rowsGroup = rowsColsGroup.add("group");
    var numRowsText = rowsGroup.add("edittext {text:'" + numRows + "', characters:3, enabled:" + (numCols == numRows ? "false" : "true") + "}");
    var numRowsLabel = rowsGroup.add("statictext {text:'Rows', enabled:" + (numCols == numRows ? "false" : "true") + "}");
    
    var separator1 = sheetOptions.add("panel {alignment:['center','fill']}");
    var equalRowsGroup = sheetOptions.add("group");
    var equalRowsBox = equalRowsGroup.add("checkbox {text:'Rows = Cols', value:" + (numCols == numRows ? "true" : "false") + "}");
    
    var fileOptions = dialog.add("panel {text:'File Save Options', margins:[15,15,15,15]}");
    var autoSaveBox = fileOptions.add("checkbox {text:'Automatically save output files', value:" + autoSave.toString() + ", orientation:'row'}");
    var fileOptionsInner = fileOptions.add("group {orientation:'row', spacing:25}");
    var resOptions = fileOptionsInner.add("group {orientation:'column'}");
    var formatOptions = fileOptionsInner.add("group {orientation:'column'}");

    var group2048 = resOptions.add("group");
    var label2048 = group2048.add("statictext {text:'2048x2048', characters:9, justify:'right', name:'2048'}");
    var box2048 = group2048.add("checkbox {value:" + sheetSizes.contains(2048) + "}");
    
    var group1024 = resOptions.add("group");
    var label1024 = group1024.add("statictext {text:'1024x1024', characters:9, justify:'right', name:'1024'}");
    var box1024 = group1024.add("checkbox {value:" + sheetSizes.contains(1024) + "}");
    
    var group512 = resOptions.add("group");
    var label512 = group512.add("statictext {text:'512x512', characters:9, justify:'right', name:'512'}");
    var box512 = group512.add("checkbox {value:" + sheetSizes.contains(512) + "}");
    
    var group256 = resOptions.add("group");
    var label256 = group256.add("statictext {text:'256x256', characters:9, justify:'right', name:'256'}");
    var box256 = group256.add("checkbox {value:" + sheetSizes.contains(256) + "}");
    
    var group128 = resOptions.add("group");
    var label128 = group128.add("statictext {text:'128x128', characters:9, justify:'right', name:'128'}");
    var box128 = group128.add("checkbox {value:" + sheetSizes.contains(128) + "}");
    
    var group64 = resOptions.add("group");
    var label64 = group64.add("statictext {text:'64x64', characters:9, justify:'right', name:'64'}");
    var box64 = group64.add("checkbox {value:" + sheetSizes.contains(64) + "}");
    
    var formatMenu = formatOptions.add("dropdownlist {title:'Format:', characters:9, justify:'right'}");
    formatMenu.add("item","PNG");
    formatMenu.add("item","TGA");
    formatMenu.selection = fileFormat == "PNG" ? formatMenu.items[0] : formatMenu.items[1];
    
    var radio24Bit = formatOptions.add("radiobutton {text:'24-bit', enabled:" + (fileFormat == "PNG" ? "false" : "true") + ", value:" + (bitDepth == "24" ? "true" : "false") + "}");
    var radio32Bit = formatOptions.add("radiobutton {text:'32-bit', value:" + (bitDepth == "32" ? "true" : "false") + "}");
    fileOptionsInner.enabled = autoSave;
    
    var buttonGroup = dialog.add("group {alignChildren:['fill','center']}");
    var OKButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");

    // Make the number of rows match the number of columns if necessary
	numColsText.onChanging = function()
	{
		if(equalRowsBox.value == true)
			numRowsText.text = numColsText.text; 
	}

	// When the checkbox is clicked, enable/disable the second input box
	equalRowsBox.onClick = function()
	{
		numRowsLabel.enabled = !numRowsLabel.enabled; 
		numRowsText.enabled = !numRowsText.enabled; 
		
		if(equalRowsBox.value == true)
			numRowsText.text = numColsText.text;
	}

    // When the autosave checkbox is clicked, enable/disable the file save options
    autoSaveBox.onClick = function()
    {
        fileOptionsInner.enabled = autoSaveBox.value;
    }

    // Event handler for OK button - writes info to variables to be saved in writeOutputFile()
	OKButton.onClick = function()
	{
        var index = 0;
        sheetFilename = filenameText.text.toString();
		numCols = parseInt(numColsText.text);
		numRows = parseInt(numRowsText.text);
         
         sheetSizes = new Array();
         // Read the sheet size checkboxes and add the active ones to the sheetSizes array
         for(i=0; i < resOptions.children.length; i++)
         {
             if(resOptions.children[i].children[1].value == true)
             {
                sheetSizes[index] = resOptions.children[i].children[0].name;
                index++;
             }
         }
         
         autoSave = (autoSaveBox.value == true && sheetSizes.length > 0);
    
         fileFormat = formatMenu.selection.toString();
         bitDepth = radio32Bit.value == true ? "32" : "24";

	    dialog.close();
	}

	// Event handler for Cancel button
	cancelButton.onClick = function()
    {
        userCancelled = true;
        dialog.close();
    }

    // Event handler for changing formats drop-down
    formatMenu.onChange = function()
    {
        if(formatMenu.selection.toString() == "PNG")
        {
            radio24Bit.value = false;
            radio32Bit.value = true;
            radio24Bit.enabled = false;
        }
        else if(formatMenu.selection.toString() == "TGA")
        {
            radio24Bit.enabled = true;
        }
    }

    dialog.center();
    dialog.show();
}