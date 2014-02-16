# Sprite Sheet from AE Composition

Intended for Unreal Engine content creators, this script enables the user to export an After Effects composition to a grid-like sprite sheet. The user is also given the option of automatically resizing and saving the sprite sheet in multiple different sizes/resolutions.

Feel free to distribute and mangle this script as you like, but please give credit where it is due.
If you find a bug or add any cool new features, drop me a line at [rohanliston.com](http://www.rohanliston.com) or submit a pull request.

## Installation

1. Place `Sprite Sheet from AE Composition.jsx` in the following directory:

* **Windows:** `<AFTEREFFECTS_INSTALL_DIRECTORY>\Support Files\Scripts`
* **Mac:** `~/Applications/Adobe After Effects <VERSION>/Scripts`

This will enable you to run the script from the `File->Scripts` menu in After Effects.

2. Place `MakeSpriteSheet_AfterEffects_Step1.jsx` and `MakeSpriteSheet_AfterEffects_Step2.jsx` in the following directory:

* **Windows:** `<MY_DOCUMENTS_LOCATION>\Adobe Scripts`
* **Mac:** `~/Documents/Adobe Scripts`

3. IMPORTANT: Make sure "Adobe ExtendScript Toolkit" is the default application for opening `.jsx` files. To set this, right-click on one of the `.jsx` files in Explorer/Finder and:

* **Windows:** Select *Open with -> Choose default program...* and locate *Adobe ExtendScript Toolkit*.
* **Mac:** Select *Get info*, and in the dialog that appears, set the default application to *Adobe ExtendScript Toolkit* and hit *Change All...*

If this is not done, the script will not be able to automatically open Photoshop and have it create the sprite sheet.

## Usage

1. With a project open and your composition selected, run the script via the *File->Scripts* menu. For testing, a sample After Effects project called `SheetTest.aep` has been provided.

2. In the next prompt:

    1. If you are auto-saving the resultant sheet, enter a name in the top section. This will be used as the prefix for your output files (eg. `T_MySpriteSheet_2048.png`).
    2. Enter the number of rows and columns you desire. This must add up to the number of frames in the work area.
    3. If you wish to auto-save, select the image sizes you wish to save, as well as the output file format.
    4. Click OK.

3. The composition will be rendered and imported into Photoshop automatically. If nothing happens for a few seconds, be patient; on my machine, Photoshop sometimes takes up to 10 seconds to start arranging the images.

4. If you chose to auto-save, the exported sprite sheet images will be exported into the same directory as the After Effects project (ie. `<AFTEREFFECTS_PROJECT_DIR>\SpriteSheets\<SHEET_NAME>\<EXPORT_NUM>`).