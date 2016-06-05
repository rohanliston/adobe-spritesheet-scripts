/**
 * SheetifyExporter: Exports a composition to file/s.
 */
function SheetifyExporter(sourceComp, config)
{
    /** Name of the output folder. TODO: Use a File dialog to pick output location. */
    this.outputFolderName = "SpriteSheets"

    /** Composition containing the spritesheet to be exported. */
    this.sourceComp = sourceComp;

    /** Configuration options specified by the user. */
    this.config = config;

    /**
     * Exports the spritesheet to whatever file sizes/formats the user specified.
     */
    this.export = function()
    {
        var queue = app.project.renderQueue;
        this.createOutputFolder();

        // Create scaled destination composition for each output size.
        for(var i = 0; i < this.config["outputSizes"].length; ++i)
        {
            var renderFile = new File(this.outputFolderName + "/" + this.config["sheetName"] + "_" + this.config["outputSizes"][i] + ".psd");

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
