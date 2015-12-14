#script "Sheetify"
#target aftereffects

if(!('bind' in Function.prototype)){
    Function.prototype.bind = function(){
        var fn = this,
        context = arguments[0],
        args = Array.prototype.slice.call(arguments, 1);
        return function(){
            return fn.apply(context, args.concat([].slice.call(arguments)));
        }
    }
}

function main()
{
    // Get project.
    var project = app.project;
    if(!project)
    {
        alert("No project open. Please select a project before running this script.");
        return;
    }

    // Get source composition.
    var sourceComp;
    if(project.items.length == 1)
    {
        sourceComp = project.items[1];
    }
    else if(project.items.length > 1 && project.activeItem instanceof CompItem)
    {
        sourceComp = project.activeItem;
    }
    else
    {
        alert("No active composition found. Please select the composition you would like to convert from the Project pane.");
        return;
    }

    // Show sheetify dialog
    var numSourceFrames = Math.floor(sourceComp.workAreaDuration * sourceComp.frameRate) + 1;
    var sheetifyDialog = new SheetifyDialog(sourceComp.name, numSourceFrames, sourceComp.width, sourceComp.height);
    sheetifyDialog.bestDimensions();
    sheetifyDialog.show();
}

function SheetifyDialog(sheetName, numSourceFrames, sourceFrameWidth, sourceFrameHeight)
{
    /** Name under which the sprite sheet will be saved. */
    this.sheetName = sheetName;

    /** Number of cols/rows the user wishes the sheet to have. */
    this.numDesiredCols = 4;
    this.numDesiredRows = 4;

    /** Width/height of source frames. */
    this.sourceFrameWidth = sourceFrameWidth;
    this.sourceFrameHeight = sourceFrameHeight;

    /** Number of source frames available. */
    this.numSourceFrames = numSourceFrames;

    /** Dialog box structure. Contents will be populated in show(). */
    this.contents = "dialog {                                                                                                           \
        text: 'Sheetify',                                                                                                               \
        alignChildren: 'fill',                                                                                                          \
        closeButton: 'true',                                                                                                            \
                                                                                                                                        \
        filenamePanel: Panel {                                                                                                          \
            text: 'Output File',                                                                                                        \
            alignChildren: 'fill',                                                                                                      \
            orientation: 'row',                                                                                                         \
            margins: [15,15,15,15],                                                                                                     \
                                                                                                                                        \
            filenameLabel: StaticText { text: 'Name' },                                                                                 \
            filenameText: EditText {                                                                                                    \
                text: 'filename',                                                                                                       \
                characters: 30,                                                                                                         \
            },                                                                                                                          \
        }                                                                                                                               \
                                                                                                                                        \
        sheetOptionsPanel: Panel {                                                                                                      \
            text: 'Sprite Sheet Options',                                                                                               \
            alignChildren: 'left',                                                                                                      \
            orientation: 'column',                                                                                                      \
            margins: [15,15,15,15],                                                                                                     \
                                                                                                                                        \
            numFramesLabel: StaticText {},                                                                                              \
                                                                                                                                        \
            dimensionsGroup: Group {                                                                                                    \
                alignChildren: 'left',                                                                                                  \
                orientation: 'column',                                                                                                  \
                                                                                                                                        \
                colsGroup: Group {                                                                                                      \
                    orientation: 'row',                                                                                                 \
                    numColsLabel: StaticText { text: 'Cols:', characters: 5 },                                                          \
                    numColsText: EditText { characters: 3 },                                                                            \
                }                                                                                                                       \
                                                                                                                                        \
                rowsGroup: Group {                                                                                                      \
                    orientation: 'row',                                                                                                 \
                    numRowsLabel: StaticText { text: 'Rows:', characters: 5 },                                                          \
                    numRowsText: EditText { characters: 3 },                                                                            \
                }                                                                                                                       \
                                                                                                                                        \
                totalLabel: StaticText {                                                                                                \
                    characters: 50                                                                                                      \
                }                                                                                                                       \
                                                                                                                                        \
                squareLabel: StaticText {                                                                                               \
                    characters: 50                                                                                                      \
                }                                                                                                                       \
                                                                                                                                        \
                disparityLabel: StaticText {                                                                                            \
                    characters: 50                                                                                                      \
                }                                                                                                                       \
            }                                                                                                                           \
        }                                                                                                                               \
                                                                                                                                        \
        saveOptionsPanel: Panel {                                                                                                       \
            text: 'File Save Options',                                                                                                  \
            alignChildren: 'left',                                                                                                      \
            orientation: 'row',                                                                                                         \
            margins: [15,15,15,15],                                                                                                     \
        }                                                                                                                               \
                                                                                                                                        \
        cancelButton: Button {                                                                                                          \
            text: 'Cancel'                                                                                                              \
        }                                                                                                                               \
                                                                                                                                        \
        okButton: Button {                                                                                                              \
            text: 'OK'                                                                                                                  \
        }                                                                                                                               \
    }";

    /** Dialog box object. */
    this.dialog = new Window(this.contents);

    /** Predefined text colours. */
    this.whitePen = this.dialog.graphics.newPen(this.dialog.graphics.PenType.SOLID_COLOR, [1.0, 1.0, 1.0], 1);
    this.redPen = this.dialog.graphics.newPen(this.dialog.graphics.PenType.SOLID_COLOR, [1.0, 0.0, 0.0], 1);
    this.greenPen = this.dialog.graphics.newPen(this.dialog.graphics.PenType.SOLID_COLOR, [0.0, 1.0, 0.0], 1);
    this.yellowPen = this.dialog.graphics.newPen(this.dialog.graphics.PenType.SOLID_COLOR, [1.0, 1.0, 0.0], 1);

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
     * @TODO: At present, this just returns the nearest perfect square root. Could probably take into account the source frame size to better support rectangular frames.
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
     * Updates the dialog contents according to the desired number of cols/rows.
     */
    this.update = function()
    {
        this.numDesiredCols = this.dialog.sheetOptionsPanel.dimensionsGroup.colsGroup.numColsText.text;
        this.numDesiredRows = this.dialog.sheetOptionsPanel.dimensionsGroup.rowsGroup.numRowsText.text;

        var total = this.numDesiredCols + " x " + this.numDesiredRows + " (" + (this.numDesiredCols * this.numDesiredRows) + ")";
        this.dialog.sheetOptionsPanel.dimensionsGroup.totalLabel.text = "Frame dimensions: " + total;
        this.dialog.sheetOptionsPanel.dimensionsGroup.squareLabel.text = "Pixel dimensions: " + this.sheetPixelSizeString();
        this.dialog.sheetOptionsPanel.dimensionsGroup.disparityLabel.text = this.disparityString();

        this.dialog.sheetOptionsPanel.dimensionsGroup.totalLabel.graphics.foregroundColor = (this.isSquare() ? this.greenPen : this.yellowPen);
        this.dialog.sheetOptionsPanel.dimensionsGroup.squareLabel.graphics.foregroundColor = (this.isSquare() ? this.greenPen : this.yellowPen);
        this.dialog.sheetOptionsPanel.dimensionsGroup.disparityLabel.graphics.foregroundColor = this.disparityColour();
    };

    /**
     * Closes the dialog box.
     */
    this.close = function()
    {
        this.dialog.close();
    };

    /**
     * Populates and shows the dialog box.
     */
    this.show = function()
    {
        // Close the dialog when the cancel button is pressed.
        this.dialog.cancelButton.addEventListener('click', this.close.bind(this), false);

        // Update the dialog when the desired rows/cols is changed.
        this.dialog.sheetOptionsPanel.dimensionsGroup.colsGroup.numColsText.addEventListener('changing', this.update.bind(this), false);
        this.dialog.sheetOptionsPanel.dimensionsGroup.rowsGroup.numRowsText.addEventListener('changing', this.update.bind(this), false);

        // Populate the dialog.
        var bestDimensions = this.bestDimensions();
        this.dialog.sheetOptionsPanel.dimensionsGroup.colsGroup.numColsText.text = bestDimensions.width;
        this.dialog.sheetOptionsPanel.dimensionsGroup.rowsGroup.numRowsText.text = bestDimensions.height;

        this.dialog.sheetOptionsPanel.numFramesLabel.text = this.numSourceFrames + " frames detected.";
        this.dialog.sheetOptionsPanel.numFramesLabel.graphics.foregroundColor = this.whitePen;

        this.update();
        this.dialog.show();
    };
}

main();