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

    /** Scaled destination compositions. */
    this.scaledComps = [];

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
            var scaledComp = this.createScaledComp(this.config["outputSizes"][i]);
            var renderItem = queue.items.add(scaledComp);
            var renderFile = new File(this.outputFolderName + "/" + this.config["sheetName"] + "_" + this.config["outputSizes"][i] + ".psd");

            renderItem.outputModules[1].file = renderFile;
            renderItem.outputModules[1].applyTemplate("Photoshop");  // TODO: Support custom templates
        }

        // Render and remove all compositions.
        queue.render();
        this.removeScaledComps();
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

    /**
     * Returns a new composition containing the source composition scaled to reach the given size.
     */
    this.createScaledComp = function(size)
    {
        // Add new composition with the desired size.
        var scaledComp = app.project.items.addComp(
            config["sheetName"] + "_spritesheet_" + size,
            size,
            size,
            this.sourceComp.pixelAspect,
            1 / sourceComp.frameRate,
            this.sourceComp.frameRate
        );

        // Copy source composition into the new one.
        var frame = scaledComp.layers.add(this.sourceComp);

        // Scale layer to fill new composition.
        var scale = size / this.sourceComp.width * 100;
        frame.property("Transform").property("Anchor Point").setValue([0,0]);
        frame.property("Transform").property("Position").setValue([0,0]);
        frame.property("Transform").property("Scale").setValue([scale, scale]);

        this.scaledComps.push(scaledComp);
        return scaledComp;
    }

    /**
     * Removes all temporary compositions that were used for resizing.
     */
    this.removeScaledComps = function()
    {
        while(this.scaledComps.length > 0)
            this.scaledComps.pop().remove();
    }
}
