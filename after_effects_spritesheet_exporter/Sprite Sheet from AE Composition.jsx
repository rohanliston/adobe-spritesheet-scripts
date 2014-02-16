/**
 * Sprite Sheet from AE Composition.jsx
 * 
 * This script allows the user to execute the "MakeSpriteSheet_AfterEffects_Step1.jsx" script from the "File->Scripts" menu rather
 * than having to browse for it. The other script is placed in the trusted My Documents\Adobe Scripts folder to avoid the 
 * annoying Adobe "Confirm Trusted Script" alert.
 * 
 * @author Rohan Liston
 * @version 1.0
 * @date 14-Feb-2012
 *
 * Feel free to distribute and mangle this script as you like, but please give credit where it is due. 
 * If you find a bug or come up with any cool new features, drop me a line at http://www.rohanliston.com !
 */

#target aftereffects

var spriteSheetScript = new File(Folder.myDocuments.absoluteURI.toString() + "/Adobe Scripts/MakeSpriteSheet_AfterEffects_Step1.jsx");

if(spriteSheetScript.exists)
    $.evalFile(spriteSheetScript);
else
    alert("Unable to locate script " + spriteSheetScript.toString());
