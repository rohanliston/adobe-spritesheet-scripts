#include "SheetifyDialogContents.jsx"

/**
 * Allows the value of 'this' to be explicity set in event listeners.
 */
if(!('bind' in Function.prototype))
{
    Function.prototype.bind = function()
    {
        var fn = this,
        context = arguments[0],
        args = Array.prototype.slice.call(arguments, 1);
        return function()
        {
            return fn.apply(context, args.concat([].slice.call(arguments)));
        }
    }
}

/**
 * SheetifyDialog: A dialog box that captures various options for exporting a sprite sheet.
 */
function SheetifyDialog(sheetName, numSourceFrames, sourceFrameWidth, sourceFrameHeight)
{
    /** Name under which the sprite sheet will be saved. */
    this.sheetName = sheetName;

    /** Number of cols/rows the user wishes the sheet to have. */
    this.numDesiredCols = 4;
    this.numDesiredRows = 4;

    /** Width/height of source frames. */
    this.sourceFrameWidth  = sourceFrameWidth;
    this.sourceFrameHeight = sourceFrameHeight;

    /** Number of source frames available. */
    this.numSourceFrames = numSourceFrames;

    /** Dialog box structure. Contents will be populated in show(). */
    this.contents = sheetifyDialogContents;

    /** Dialog box object. */
    this.dialog = new Window(this.contents);

    /** Predefined text colours. */
    this.greyPen   = this.dialog.graphics.newPen(this.dialog.graphics.PenType.SOLID_COLOR, [0.55, 0.55, 0.55], 1);
    this.whitePen  = this.dialog.graphics.newPen(this.dialog.graphics.PenType.SOLID_COLOR, [1.0,  1.0,  1.0],  1);
    this.redPen    = this.dialog.graphics.newPen(this.dialog.graphics.PenType.SOLID_COLOR, [1.0,  0.0,  0.0],  1);
    this.greenPen  = this.dialog.graphics.newPen(this.dialog.graphics.PenType.SOLID_COLOR, [0.0,  1.0,  0.0],  1);
    this.yellowPen = this.dialog.graphics.newPen(this.dialog.graphics.PenType.SOLID_COLOR, [1.0,  1.0,  0.0],  1);

    /** If true, the user has cancelled the dialog. */
    this.cancelled = false;

    /** Cached UI labels/checkboxes for output sizes. */
    var sizesGroup = this.dialog.saveOptionsPanel.sizesGroup;
    this.outputSizeElements = [
        { "size": 128,  "label": sizesGroup.size128Group.size128Comment,   "checkbox": sizesGroup.size128Group.size128Checkbox},
        { "size": 256,  "label": sizesGroup.size256Group.size256Comment,   "checkbox": sizesGroup.size256Group.size256Checkbox},
        { "size": 512,  "label": sizesGroup.size512Group.size512Comment,   "checkbox": sizesGroup.size512Group.size512Checkbox},
        { "size": 1024, "label": sizesGroup.size1024Group.size1024Comment, "checkbox": sizesGroup.size1024Group.size1024Checkbox},
        { "size": 2048, "label": sizesGroup.size2048Group.size2048Comment, "checkbox": sizesGroup.size2048Group.size2048Checkbox},
        { "size": 4096, "label": sizesGroup.size4096Group.size4096Comment, "checkbox": sizesGroup.size4096Group.size4096Checkbox},
        { "size": 8192, "label": sizesGroup.size8192Group.size8192Comment, "checkbox": sizesGroup.size8192Group.size8192Checkbox}
    ]

    /**
     * Returns a string for debugging purposes.
     */
    this.debugString = function()
    {
        return "Sheet name: "                  + this.sheetName
             + "\nNum source frames: "         + this.numSourceFrames
             + "\nSource frame width/height: " + this.sourceFrameWidth + " x " + this.sourceFrameHeight
             + "\nDesired cols/rows: "         + this.numDesiredCols + " x " + this.numDesiredRows
             + "\nResultant pixel size: "      + this.sheetPixelSizeString()
             + "\nSquare: "                    + (this.isSquare() ? "true" : "false")
             + "\nOutput sizes: "              + this.outputSizes().toString();
    };

    /**
     * Returns a hash containing the configuration the user has entered.
     */
    this.config = function()
    {
        return {
            "sheetName": this.sheetName,
            "frameSize": {
                "width":  this.sourceFrameWidth,
                "height": this.sourceFrameHeight
            },
            "numFrames": {
                "cols": this.numDesiredCols,
                "rows": this.numDesiredRows,
                "total": this.numDestinationFrames()
            },
            "sheetPixelSize": this.sheetPixelSize(),
            "outputSizes": this.outputSizes()
        };
    }

    /**
     * Returns the number of frames that will be rendered given the number of desired cols/rows.
     */
    this.numDestinationFrames = function()
    {
        return this.numDesiredCols * this.numDesiredRows;
    };

    /**
     * Returns the 'disparity' in the number of destination frames versus the number of source frames available.
     * If negative: Not all source frames will appear in the sprite sheet.
     * If zero:     All source frames will be used.
     * If positive: The sprite sheet will contain blank frames.
     */
    this.disparity = function()
    {
        return this.numDestinationFrames() - this.numSourceFrames;
    };

    /**
     * Returns a string describing how the sprite sheet will look. See disparity() for details.
     */
    this.disparityString = function()
    {
        var disparity = this.disparity();
        if(disparity == 0)
            return "Sheet will be filled perfectly.";
        else if(disparity < 0)
            return -disparity + " " + (disparity === -1 ? "frame" : "frames") + " will be left out.";
        else if(disparity > 0)
            return "Sheet will contain " + disparity + " empty " + (disparity == 1 ? "frame." : "frames.");
        else
            return "Invalid cols/rows input.";
    };

    /**
     * Returns the colour to use for the disparity string.
     */
    this.disparityColour = function()
    {
        if(this.disparity() == 0)
            return this.greenPen;

        return this.redPen;
    }

    /**
     * Returns true if the resultant sprite sheet will be perfectly square.
     */
    this.isSquare = function()
    {
        return (
            this.numDesiredCols == this.numDesiredRows &&
            this.sourceFrameWidth == this.sourceFrameHeight
        );
    };

    /**
     * Returns the pixel size of the resultant sprite sheet encapsulated in a JS object.
     */
    this.sheetPixelSize = function() {
        return {
            width:  this.sourceFrameWidth * this.numDesiredCols,
            height: this.sourceFrameHeight * this.numDesiredRows
        };
    };

    /**
     * Returns a string representing the retultant sprite sheet's size and whether or not it will be square.
     */
    this.sheetPixelSizeString = function()
    {
        var size = this.sheetPixelSize();
        return size.width + " x " + size.height + (this.isSquare() ? "" : " (not square)");
    }

    /**
     * Returns a set of dimensions that is most likely to produce a square sprite sheet. Used for populating the dialog with initial values.
     * TODO: At present, this just returns the nearest perfect square root. Could probably take into account the source frame size to better support rectangular frames.
     */
    this.bestDimensions = function()
    {
        var x = Math.round(Math.sqrt(this.numSourceFrames));
        return {
            width: x,
            height: x
        };
    }

    /**
     * Returns an array containing each size to be exported.
     */
    this.outputSizes = function()
    {
        var sizes = [];
        var sizesGroup = this.dialog.saveOptionsPanel.sizesGroup;

        if(sizesGroup.size8192Group.size8192Checkbox.value === true) sizes.push(8192);
        if(sizesGroup.size4096Group.size4096Checkbox.value === true) sizes.push(4096);
        if(sizesGroup.size2048Group.size2048Checkbox.value === true) sizes.push(2048);
        if(sizesGroup.size1024Group.size1024Checkbox.value === true) sizes.push(1024);
        if(sizesGroup.size512Group.size512Checkbox.value === true)   sizes.push(512);
        if(sizesGroup.size256Group.size256Checkbox.value === true)   sizes.push(256);
        if(sizesGroup.size128Group.size128Checkbox.value === true)   sizes.push(128);

        return sizes;
    };

    /**
     * Updates the dialog contents according to the desired number of cols/rows.
     */
    this.update = function()
    {
        // Update internal variables
        this.sheetName = this.dialog.filenamePanel.filenameText.text;
        this.numDesiredCols = this.dialog.sheetOptionsPanel.dimensionsGroup.colsGroup.numColsText.text;
        this.numDesiredRows = this.dialog.sheetOptionsPanel.dimensionsGroup.rowsGroup.numRowsText.text;

        // Recalculate dimensions
        var total = this.numDesiredCols + " x " + this.numDesiredRows + " (" + (this.numDesiredCols * this.numDesiredRows) + ")";
        this.dialog.sheetOptionsPanel.dimensionsGroup.totalLabel.text = "Frame dimensions: " + total;
        this.dialog.sheetOptionsPanel.dimensionsGroup.squareLabel.text = "Pixel dimensions: " + this.sheetPixelSizeString();
        this.dialog.sheetOptionsPanel.dimensionsGroup.disparityLabel.text = this.disparityString();

        // Determine colours to be used
        this.dialog.sheetOptionsPanel.dimensionsGroup.totalLabel.graphics.foregroundColor = (this.isSquare() ? this.greenPen : this.yellowPen);
        this.dialog.sheetOptionsPanel.dimensionsGroup.squareLabel.graphics.foregroundColor = (this.isSquare() ? this.greenPen : this.yellowPen);
        this.dialog.sheetOptionsPanel.dimensionsGroup.disparityLabel.graphics.foregroundColor = this.disparityColour();

        // Comment on appropriate output sizes
        var bestWidth = this.numDesiredCols * this.sourceFrameWidth;
        for(var i = 0; i < this.outputSizeElements.length; ++i)
        {
            var label = this.outputSizeElements[i];
            if(bestWidth >= label["size"])
            {
                label["label"].text = "OK";
                if(label["checkbox"].value === true)
                    label["label"].graphics.foregroundColor = this.greenPen;
                else
                    label["label"].graphics.foregroundColor = this.greyPen;
            }
            else
            {
                label["label"].text = "Not recommended";
                if(label["checkbox"].value === true)
                    label["label"].graphics.foregroundColor = this.yellowPen;
                else
                    label["label"].graphics.foregroundColor = this.greyPen;
            }
        }
    };

    /**
     * Closes the dialog box.
     */
    this.cancel = function()
    {
        this.cancelled = true;
        this.dialog.close();
    };

    /**
     * Populates and shows the dialog box.
     */
    this.show = function()
    {
        // Close the dialog when the cancel button is pressed.
        this.dialog.buttonGroup.cancelButton.onClick = this.cancel.bind(this);

        // Update the dialog when the desired rows/cols is changed.
        this.dialog.sheetOptionsPanel.dimensionsGroup.colsGroup.numColsText.addEventListener('changing', this.update.bind(this), false);
        this.dialog.sheetOptionsPanel.dimensionsGroup.rowsGroup.numRowsText.addEventListener('changing', this.update.bind(this), false);

        // Update when the sheet name changes.
        this.dialog.filenamePanel.filenameText.text = this.sheetName;
        this.dialog.filenamePanel.filenameText.addEventListener('changing', this.update.bind(this), false);

        // Update when checkboxes are clicked.
        for(var i = 0; i < this.outputSizeElements.length; ++i)
            var checkbox = this.outputSizeElements[i]["checkbox"].onClick = this.update.bind(this);

        // Populate the dialog.
        var bestDimensions = this.bestDimensions();
        this.dialog.sheetOptionsPanel.dimensionsGroup.colsGroup.numColsText.text = bestDimensions.width;
        this.dialog.sheetOptionsPanel.dimensionsGroup.rowsGroup.numRowsText.text = bestDimensions.height;
        this.dialog.sheetOptionsPanel.numFramesLabel.text = this.numSourceFrames + " frames detected.";
        this.dialog.sheetOptionsPanel.numFramesLabel.graphics.foregroundColor = this.whitePen;

        // Make sure everything is up to date, then show the dialog.
        this.update();
        this.dialog.show();
    };
}
