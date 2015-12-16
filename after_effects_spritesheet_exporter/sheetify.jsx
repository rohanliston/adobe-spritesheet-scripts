#script "Sheetify"
#target aftereffects

// Load support scripts.
var scriptPath = new File($.fileName).path;
var includeFiles = ["SheetifyDialog.jsx"];
for(var i = 0; i < includeFiles.length; ++i)
{
    includeFile = new File(scriptPath + "/(support)/" + includeFiles[i]);
    if(includeFile.exists)
        $.evalFile(includeFile);
    else
        alert("Support script not found: " + includeFile.toString());
}

/**
 * Main function. Finds the active composition, prompts the user for options, and renders the spritesheet.
 */
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
        // Only one composition to choose from, so it doesn't matter whether it's active or not.
        sourceComp = project.items[1];
    }
    else if(project.items.length > 1 && project.activeItem instanceof CompItem)
    {
        // If a composition is currently active, assume we're rendering that one.
        sourceComp = project.activeItem;
    }
    else
    {
        alert("No active composition found. Please select the composition you would like to convert from the Project pane.");
        return;
    }

    // Get composition properties.
    var numSourceFrames = Math.floor(sourceComp.workAreaDuration * sourceComp.frameRate) + 1;

    // Show options dialog.
    var sheetifyDialog = new SheetifyDialog(sourceComp.name, numSourceFrames, sourceComp.width, sourceComp.height);
    sheetifyDialog.bestDimensions();
    sheetifyDialog.show();

    // Sheetify!
}

main();