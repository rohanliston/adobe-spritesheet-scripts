# Sprite Sheet from AE Composition

This script enables the user to export an After Effects composition to a grid-like sprite sheet. The user is also given the option of automatically resizing and saving the sprite sheet in multiple different sizes/resolutions.

## Installation

1. Copy the contents of this directory to the following location:

* **Windows:** `<AFTER_EFFECTS_INSTALL_DIRECTORY>\Support Files\Scripts`
* **OSX:** `~/Applications/Adobe After Effects <VERSION>/Scripts`

## Usage

1. With a project open and your composition selected, run the script via the *File->Scripts* menu. For testing, a sample After Effects project called `spritesheet_test.aep` has been provided.

2. In the next prompt:

    1. Enter a name in the top section. This will be used as the filename prefix for your output files (eg. `T_MySpriteSheet_2048.png`).
    2. Enter the number of rows and columns you desire. This should add up to the number of frames in the work area to avoid extraneous or missing frames.
    3. Select the image sizes you wish to save, as well as the output file format.
    4. Click OK.

4. The exported sprite sheet images will be exported into the same directory as the After Effects project (ie. `<AFTEREFFECTS_PROJECT_DIR>\SpriteSheets\<SHEET_NAME>\<EXPORT_NUM>`).
