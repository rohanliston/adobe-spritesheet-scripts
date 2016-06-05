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
    this.dialog = new SheetifyDialogContents();

    /** If true, the user has cancelled the dialog. */
    this.cancelled = false;

    /**
     * Returns a string for debugging purposes.
     */
    this.toString = function()
    {
        return JSON.stringify(this.config());
    };

    /**
     * Returns a hash containing the configuration the user has entered.
     */
    this.config = function()
    {
        return {
            sheetName: this.sheetName,
            frameSize: {
                width:  this.sourceFrameWidth,
                height: this.sourceFrameHeight
            },
            numFrames: {
                cols: this.numDesiredCols,
                rows: this.numDesiredRows,
                total: this.numDestinationFrames()
            },
            sheetPixelSize: this.sheetPixelSize(),
            outputSizes: this.outputSizes()
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
            return this.dialog.greenPen;

        return this.dialog.redPen;
    }

    /**
     * Returns true if the resultant sprite sheet will be perfectly square.
     */
    this.isSquare = function()
    {
        return (
            this.numDesiredCols   == this.numDesiredRows &&
            this.sourceFrameWidth == this.sourceFrameHeight
        );
    };

    /**
     * Returns the pixel size of the resultant sprite sheet encapsulated in a JS object.
     */
    this.sheetPixelSize = function() {
        return {
            width:  this.sourceFrameWidth  * this.numDesiredCols,
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
     * TODO: At present, this just returns the nearest perfect square root. Should probably take into account the source frame size to better support rectangular frames.
     */
    this.bestCellConfiguration = function()
    {
        var x = Math.round(Math.sqrt(this.numSourceFrames));
        return {
            rows: x,
            cols: x
        };
    }

    /**
     * Returns an array containing each size to be exported.
     */
    this.outputSizes = function()
    {
        var sizes = [];
        if(this.dialog.sizeSquareGroup.enabled)
        {
            // Add all selected square sizes
            for(var i = 0; i < this.dialog.squareOutputSizeElements.length; ++i)
            {
                var item = this.dialog.squareOutputSizeElements[i];
                if(item["checkbox"].value === true)
                    sizes.push(item["size"]);
            }
        }
        else
        {
            // Add original size
            var pixelSize = this.sheetPixelSize();
            sizes.push({
                width:  pixelSize.width,
                height: pixelSize.height
            })
        }

        return sizes;
    };

    /**
     * Synchronises internal configuration with UI input values.
     */
    this.updateConfig = function()
    {
        this.sheetName      = this.dialog.filenameText.text;
        this.numDesiredCols = this.dialog.numColsText.text;
        this.numDesiredRows = this.dialog.numRowsText.text;
    };

    /**
     * Recalculates dimensions area text.
     */
    this.updateDimensions = function()
    {
        // Calculate dimensions.
        var total = this.numDesiredCols + " x " + this.numDesiredRows + " (" + (this.numDesiredCols * this.numDesiredRows) + ")";
        this.dialog.totalLabel.text     = "Frame dimensions: " + total;
        this.dialog.squareLabel.text    = "Pixel dimensions: " + this.sheetPixelSizeString();
        this.dialog.disparityLabel.text = this.disparityString();

        // Determine colours to be used.
        this.dialog.totalLabel.graphics.foregroundColor     = (this.isSquare() ? this.dialog.greenPen : this.dialog.yellowPen);
        this.dialog.squareLabel.graphics.foregroundColor    = (this.isSquare() ? this.dialog.greenPen : this.dialog.yellowPen);
        this.dialog.disparityLabel.graphics.foregroundColor = this.disparityColour();
    };

    /**
     * Updates the comments next to each checkbox.
     */
    this.updateSquareSizeComments = function()
    {
        var largestSensibleSize = {
            width: this.numDesiredCols  * this.sourceFrameWidth,
            height: this.numDesiredRows * this.sourceFrameHeight
        }

        for(var i = 0; i < this.dialog.squareOutputSizeElements.length; ++i)
        {
            var label = this.dialog.squareOutputSizeElements[i];
            if(largestSensibleSize.width >= label.size.width || largestSensibleSize.height >= label.size.height)
                this.dialog.setOK(label.comment, label.checkbox);
            else
                this.dialog.setNotRecommended(label.comment, label.checkbox);
        }
    }

    /**
     * Enables the square sizes group, disabling the non-square group.
     */
    this.activateSquareSizesGroup = function()
    {
        this.dialog.sizeSquareGroup.enabled                      = true;
        this.dialog.sizeOriginalGroup.enabled                    = false;
        this.dialog.sizeOriginalComment.graphics.foregroundColor = this.dialog.greyPen;
        this.dialog.sizeOriginalComment.text                     = "Unavailable";
    }

    /**
     * Enables the non-square group, disabling the square sizes group.
     */
    this.activateOriginalSizesGroup = function()
    {
        this.dialog.sizeOriginalGroup.enabled = true;
        this.dialog.sizeSquareGroup.enabled   = false;
        this.dialog.sizeOriginalComment.text  = "OK";

        if(this.dialog.sizeOriginalCheckbox.value === true)
            this.dialog.sizeOriginalComment.graphics.foregroundColor = this.dialog.greenPen;
        else
            this.dialog.sizeOriginalComment.graphics.foregroundColor = this.dialog.greyPen;
    }

    /**
     * Updates the dialog contents according to the desired number of cols/rows.
     */
    this.update = function()
    {
        this.updateConfig();
        this.updateDimensions();

        // Activate appropriate checkbox group.
        if(this.isSquare())
        {
            this.activateSquareSizesGroup();
            this.updateSquareSizeComments();
        }
        else
        {
            this.activateOriginalSizesGroup();
        }
    };

    /**
     * Handler for cancel button.
     */
    this.cancel = function()
    {
        this.cancelled = true;
        this.dialog.window.close();
    };

    /**
     * Handler for OK button.
     */
    this.ok = function()
    {
        // TODO: Tidy this up
        var boxChecked = false;
        for(var i = 0; i < this.dialog.squareOutputSizeElements.length; ++i)
        {
            if(this.dialog.squareOutputSizeElements[i].checkbox.value === true)
                boxChecked = true;
        }

        if(this.dialog.sizeOriginalCheckbox.value === true)
            boxChecked = true;

        // Ensure at least one output checkbox is checked.
        if(boxChecked)
            this.dialog.window.close();
        else
            alert("At least one output size must be checked.");
    }

    /**
     * Adds event listeners to dialog box buttons.
     */
    this.bindButtons = function()
    {
        // Close the dialog when the cancel button is pressed.
        this.dialog.cancelButton.onClick = this.cancel.bind(this);
        this.dialog.okButton.onClick     = this.ok.bind(this);
    }

    /**
     * Adds event listeners to text inputs.
     */
    this.bindTextInputs = function()
    {
        // Update the dialog when the desired rows/cols is changed.
        this.dialog.numColsText.addEventListener('changing', this.update.bind(this), false);
        this.dialog.numRowsText.addEventListener('changing', this.update.bind(this), false);

        // Update when the sheet name changes.
        this.dialog.filenameText.addEventListener('changing', this.update.bind(this), false);
    }

    /**
     * Adds event listeners to checkboxes.
     */
    this.bindCheckboxes = function()
    {
        // Update when checkboxes are clicked.
        this.dialog.sizeOriginalCheckbox.onClick = this.update.bind(this);
        for(var i = 0; i < this.dialog.squareOutputSizeElements.length; ++i)
            var checkbox = this.dialog.squareOutputSizeElements[i].checkbox.onClick = this.update.bind(this);
    }

    /**
     * Populates the dialog box with initial values.
     */
    this.populateDialog = function()
    {
        var bestCellConfiguration = this.bestCellConfiguration();

        this.dialog.filenameText.text   = this.sheetName;
        this.dialog.numColsText.text    = bestCellConfiguration.cols;
        this.dialog.numRowsText.text    = bestCellConfiguration.rows;
        this.dialog.numFramesLabel.text = this.numSourceFrames + " frames detected.";
        this.dialog.numFramesLabelPen   = this.dialog.whitePen;
    }

    /**
     * Populates and shows the dialog box.
     */
    this.show = function()
    {
        // Bind UI actions.
        this.bindButtons();
        this.bindTextInputs();
        this.bindCheckboxes();

        // Add initial values.
        this.populateDialog();

        // Make sure everything is up to date, then show the dialog.
        this.update();
        this.dialog.window.show();
    };
}
