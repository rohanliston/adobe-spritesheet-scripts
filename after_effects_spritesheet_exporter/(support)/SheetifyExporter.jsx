/**
 * SheetifyExporter: Exports a composition to file/s.
 */
function SheetifyExporter()
{
    /** Name of the output folder. TODO: Use a File dialog to pick output location. */
    this.outputFolderName = "SpriteSheets"

    /**
     * Exports the spritesheet to whatever file sizes/formats the user specified.
     */
    this.export = function(comp, config)
    {
        var queue = app.project.renderQueue;
        this.createOutputFolder();

        // Render all output file sizes
        for(var i = 0; i < config["outputSizes"].length; ++i)
        {
            var renderItem = queue.items.add(comp);
            var renderFile = new File(this.outputFolderName + "/" + config["sheetName"] + "_" + config["outputSizes"][i] + ".psd");

            renderItem.outputModules[1].file = renderFile;
            renderItem.outputModules[1].applyTemplate("TIFF Sequence with Alpha");  // TODO: Support custom templates

            alert(renderItem.outputModules[1].templates[4])
        }

        queue.render();
    }

    /**
     * Creates the output folder if it doesn't exist.
     */
    this.createOutputFolder = function()
    {
        var outputFolder = new Folder(this.outputFolderName);
        if(!outputFolder.exists)
        {
            if(!outputFolder.create())
                throw Error("Could not create output folder. Make sure \"Allow Scripts to Write Files and Access Network\" is enabled under Edit->Preferences->General.");
        }
    };
}
