// My kingdom for ES6 backtick strings...
var sheetifyDialogContents = "dialog {                                                                                              \
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
        text: 'File Save Options',                                                                                                  \
        alignChildren: 'left',                                                                                                      \
        orientation: 'row',                                                                                                         \
        margins: [15,15,15,15],                                                                                                     \
                                                                                                                                    \
        sizesGroup: Group {                                                                                                         \
            orientation: 'column',                                                                                                  \
                                                                                                                                    \
            size8192Group: Group {                                                                                                  \
              orientation: 'row',                                                                                                   \
              size8192Label: StaticText { text: '8192x8192', characters: 10 },                                                      \
              size8192Checkbox: Checkbox { value: false },                                                                          \
              size8192Comment: StaticText { text: '', characters: 15 },                                                             \
            }                                                                                                                       \
                                                                                                                                    \
            size4096Group: Group {                                                                                                  \
              orientation: 'row',                                                                                                   \
              size4096Label: StaticText { text: '4096x4096', characters: 10 },                                                      \
              size4096Checkbox: Checkbox { value: false },                                                                          \
              size4096Comment: StaticText { text: '', characters: 15 },                                                             \
            }                                                                                                                       \
                                                                                                                                    \
            size2048Group: Group {                                                                                                  \
              orientation: 'row',                                                                                                   \
              size2048Label: StaticText { text: '2048x2048', characters: 10 },                                                      \
              size2048Checkbox: Checkbox { value: false },                                                                          \
              size2048Comment: StaticText { text: '', characters: 15 },                                                             \
            }                                                                                                                       \
                                                                                                                                    \
            size1024Group: Group {                                                                                                  \
              orientation: 'row',                                                                                                   \
              size1024Label: StaticText { text: '1024x1024', characters: 10 },                                                      \
              size1024Checkbox: Checkbox { value: false },                                                                          \
              size1024Comment: StaticText { text: '', characters: 15 },                                                             \
            }                                                                                                                       \
                                                                                                                                    \
            size512Group: Group {                                                                                                   \
              orientation: 'row',                                                                                                   \
              size512Label: StaticText { text: '512x512', characters: 10 },                                                         \
              size512Checkbox: Checkbox { value: false },                                                                           \
              size512Comment: StaticText { text: '', characters: 15 },                                                              \
            }                                                                                                                       \
                                                                                                                                    \
            size256Group: Group {                                                                                                   \
              orientation: 'row',                                                                                                   \
              size256Label: StaticText { text: '256x256', characters: 10 },                                                         \
              size256Checkbox: Checkbox { value: false },                                                                           \
              size256Comment: StaticText { text: '', characters: 15 },                                                              \
            }                                                                                                                       \
                                                                                                                                    \
            size128Group: Group {                                                                                                   \
              orientation: 'row',                                                                                                   \
              size128Label: StaticText { text: '128x128', characters: 10 },                                                         \
              size128Checkbox: Checkbox { value: false },                                                                           \
              size128Comment: StaticText { text: '', characters: 15 },                                                              \
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
