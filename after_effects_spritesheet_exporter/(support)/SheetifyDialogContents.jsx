/**
 * SheetifyDialogContents: Defines the contents of a SheetifyDialog, separating presentation from logic.
 */
function SheetifyDialogContents()
{
    /** Definition of the dialog box. My kingdom for ES6 backtick strings. */
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
            filenameText: EditText { characters: 30 },                                                                                  \
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
                    characters: 35                                                                                                      \
                }                                                                                                                       \
                                                                                                                                        \
                squareLabel: StaticText {                                                                                               \
                    characters: 35                                                                                                      \
                }                                                                                                                       \
                                                                                                                                        \
                disparityLabel: StaticText {                                                                                            \
                    characters: 35                                                                                                      \
                }                                                                                                                       \
            }                                                                                                                           \
        }                                                                                                                               \
                                                                                                                                        \
        saveOptionsPanel: Panel {                                                                                                       \
            text: 'Output Size Options',                                                                                                \
            alignChildren: 'left',                                                                                                      \
            orientation: 'row',                                                                                                         \
            margins: [15,15,15,15],                                                                                                     \
                                                                                                                                        \
            sizesGroup: Group {                                                                                                         \
                orientation: 'column',                                                                                                  \
                                                                                                                                        \
                sizeOriginalGroup: Group {                                                                                              \
                  orientation: 'row',                                                                                                   \
                  sizeOriginalLabel: StaticText { text: 'Original', characters: 10 },                                                   \
                  sizeOriginalCheckbox: Checkbox { value: false },                                                                      \
                  sizeOriginalComment: StaticText { text: '', characters: 15 },                                                         \
                }                                                                                                                       \
                                                                                                                                        \
                sizeSquareGroup: Group {                                                                                                \
                    orientation: 'column',                                                                                              \
                    size8192Group: Group {                                                                                              \
                      orientation: 'row',                                                                                               \
                      size8192Label: StaticText { text: '8192x8192', characters: 10 },                                                  \
                      size8192Checkbox: Checkbox { value: false },                                                                      \
                      size8192Comment: StaticText { text: '', characters: 15 },                                                         \
                    }                                                                                                                   \
                                                                                                                                        \
                    size4096Group: Group {                                                                                              \
                      orientation: 'row',                                                                                               \
                      size4096Label: StaticText { text: '4096x4096', characters: 10 },                                                  \
                      size4096Checkbox: Checkbox { value: false },                                                                      \
                      size4096Comment: StaticText { text: '', characters: 15 },                                                         \
                    }                                                                                                                   \
                                                                                                                                        \
                    size2048Group: Group {                                                                                              \
                      orientation: 'row',                                                                                               \
                      size2048Label: StaticText { text: '2048x2048', characters: 10 },                                                  \
                      size2048Checkbox: Checkbox { value: false },                                                                      \
                      size2048Comment: StaticText { text: '', characters: 15 },                                                         \
                    }                                                                                                                   \
                                                                                                                                        \
                    size1024Group: Group {                                                                                              \
                      orientation: 'row',                                                                                               \
                      size1024Label: StaticText { text: '1024x1024', characters: 10 },                                                  \
                      size1024Checkbox: Checkbox { value: false },                                                                      \
                      size1024Comment: StaticText { text: '', characters: 15 },                                                         \
                    }                                                                                                                   \
                                                                                                                                        \
                    size512Group: Group {                                                                                               \
                      orientation: 'row',                                                                                               \
                      size512Label: StaticText { text: '512x512', characters: 10 },                                                     \
                      size512Checkbox: Checkbox { value: false },                                                                       \
                      size512Comment: StaticText { text: '', characters: 15 },                                                          \
                    }                                                                                                                   \
                                                                                                                                        \
                    size256Group: Group {                                                                                               \
                      orientation: 'row',                                                                                               \
                      size256Label: StaticText { text: '256x256', characters: 10 },                                                     \
                      size256Checkbox: Checkbox { value: false },                                                                       \
                      size256Comment: StaticText { text: '', characters: 15 },                                                          \
                    }                                                                                                                   \
                                                                                                                                        \
                    size128Group: Group {                                                                                               \
                      orientation: 'row',                                                                                               \
                      size128Label: StaticText { text: '128x128', characters: 10 },                                                     \
                      size128Checkbox: Checkbox { value: false },                                                                       \
                      size128Comment: StaticText { text: '', characters: 15 },                                                          \
                    }                                                                                                                   \
                }                                                                                                                       \
            }                                                                                                                           \
        }                                                                                                                               \
                                                                                                                                        \
        buttonGroup: Group {                                                                                                            \
            orientation: 'row',                                                                                                         \
            alignment: 'right',                                                                                                         \
                                                                                                                                        \
            cancelButton: Button {                                                                                                      \
                text: 'Cancel'                                                                                                          \
            }                                                                                                                           \
                                                                                                                                        \
            okButton: Button {                                                                                                          \
                text: 'OK'                                                                                                              \
            }                                                                                                                           \
        }                                                                                                                               \
    }";

    this.window = new Window(this.contents);

    // References to UI elements to prevent us from going dotty
    this.filenameText           = this.window.filenamePanel.filenameText;
    this.sheetOptionsPanel      = this.window.sheetOptionsPanel;
    this.numFramesLabel         = this.sheetOptionsPanel.numFramesLabel;
    this.numColsText            = this.sheetOptionsPanel.dimensionsGroup.colsGroup.numColsText;
    this.numRowsText            = this.sheetOptionsPanel.dimensionsGroup.rowsGroup.numRowsText;
    this.totalLabel             = this.sheetOptionsPanel.dimensionsGroup.totalLabel;
    this.squareLabel            = this.sheetOptionsPanel.dimensionsGroup.squareLabel;
    this.disparityLabel         = this.sheetOptionsPanel.dimensionsGroup.disparityLabel;
    this.saveOptionsPanel       = this.window.saveOptionsPanel;
    this.sizeOriginalGroup      = this.saveOptionsPanel.sizesGroup.sizeOriginalGroup;
    this.sizeOriginalCheckbox   = this.sizeOriginalGroup.sizeOriginalCheckbox;
    this.sizeOriginalComment    = this.sizeOriginalGroup.sizeOriginalComment;
    this.sizeSquareGroup        = this.window.saveOptionsPanel.sizesGroup.sizeSquareGroup;
    this.size8192Checkbox       = this.sizeSquareGroup.size8192Group.size8192Checkbox;
    this.size8192Comment        = this.sizeSquareGroup.size8192Group.size8192Comment;
    this.size4096Checkbox       = this.sizeSquareGroup.size4096Group.size4096Checkbox;
    this.size4096Comment        = this.sizeSquareGroup.size4096Group.size4096Comment;
    this.size2048Checkbox       = this.sizeSquareGroup.size2048Group.size2048Checkbox;
    this.size2048Comment        = this.sizeSquareGroup.size2048Group.size2048Comment;
    this.size1024Checkbox       = this.sizeSquareGroup.size1024Group.size1024Checkbox;
    this.size1024Comment        = this.sizeSquareGroup.size1024Group.size1024Comment;
    this.size512Checkbox        = this.sizeSquareGroup.size512Group.size512Checkbox;
    this.size512Comment         = this.sizeSquareGroup.size512Group.size512Comment;
    this.size256Checkbox        = this.sizeSquareGroup.size256Group.size256Checkbox;
    this.size256Comment         = this.sizeSquareGroup.size256Group.size256Comment;
    this.size128Checkbox        = this.sizeSquareGroup.size128Group.size128Checkbox;
    this.size128Comment         = this.sizeSquareGroup.size128Group.size128Comment;
    this.cancelButton           = this.window.buttonGroup.cancelButton;
    this.okButton               = this.window.buttonGroup.okButton;

    /** Predefined text colours. */
    this.greyPen   = this.window.graphics.newPen(this.window.graphics.PenType.SOLID_COLOR, [0.55, 0.55, 0.55], 1);
    this.whitePen  = this.window.graphics.newPen(this.window.graphics.PenType.SOLID_COLOR, [1.0,  1.0,  1.0],  1);
    this.redPen    = this.window.graphics.newPen(this.window.graphics.PenType.SOLID_COLOR, [1.0,  0.0,  0.0],  1);
    this.greenPen  = this.window.graphics.newPen(this.window.graphics.PenType.SOLID_COLOR, [0.0,  1.0,  0.0],  1);
    this.yellowPen = this.window.graphics.newPen(this.window.graphics.PenType.SOLID_COLOR, [1.0,  1.0,  0.0],  1);

    /** Cached UI labels/checkboxes for output sizes. */
    this.squareOutputSizeElements = [
        { size: { width: 128,  height: 128  }, comment: this.size128Comment,  checkbox: this.size128Checkbox  },
        { size: { width: 256,  height: 256  }, comment: this.size256Comment,  checkbox: this.size256Checkbox  },
        { size: { width: 512,  height: 512  }, comment: this.size512Comment,  checkbox: this.size512Checkbox  },
        { size: { width: 1024, height: 1024 }, comment: this.size1024Comment, checkbox: this.size1024Checkbox },
        { size: { width: 2048, height: 2048 }, comment: this.size2048Comment, checkbox: this.size2048Checkbox },
        { size: { width: 4096, height: 4096 }, comment: this.size4096Comment, checkbox: this.size4096Checkbox },
        { size: { width: 8192, height: 8192 }, comment: this.size8192Comment, checkbox: this.size8192Checkbox }
    ]

    /**
     * Changes the given size label to "OK", indicating that the output size is sensible.
     */
    this.setOK = function(sizeElementLabel, sizeElementCheckbox)
    {
        sizeElementLabel.text = "OK";
        if(sizeElementCheckbox.value === true)
            sizeElementLabel.graphics.foregroundColor = this.greenPen;
        else
            sizeElementLabel.graphics.foregroundColor = this.greyPen;
    };

    /**
     * Changes the given size label to "Not recommended", indicating that the output size will be unnecessarily large.
     */
    this.setNotRecommended = function(sizeElementLabel, sizeElementCheckbox)
    {
        sizeElementLabel.text = "Not recommended";
        if(sizeElementCheckbox.value === true)
            sizeElementLabel.graphics.foregroundColor = this.yellowPen;
        else
            sizeElementLabel.graphics.foregroundColor = this.greyPen;
    }
}
