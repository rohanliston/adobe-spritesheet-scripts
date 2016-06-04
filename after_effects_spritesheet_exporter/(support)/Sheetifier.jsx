#include "SheetifyExporter.jsx"

/**
 * Sheetifier: Generates sprite sheets from After Effects compositions.
 */
function Sheetifier(sourceComp, config)
{
    this.config = config;
    this.sourceComp = sourceComp;
    this.destComp = null;

    /**
     * Creates a sprite sheet according to the supplied configuration and exports the desired output files.
     */
    this.sheetify = function()
    {
        var currentFrame = 1;
        var frameWidth = this.config["frameSize"]["width"];
        var frameHeight = this.config["frameSize"]["height"];

        // Create destination composition.
        this.createDestComp();
        this.destComp.openInViewer();

        // Import the source composition once per frame and shift its start time back one frame.
        for(var row = this.config["numFrames"]["rows"]-1; row >= 0; --row)
        {
            for(var col = this.config["numFrames"]["cols"]-1; col >= 0; --col)
            {
                var frame = this.destComp.layers.add(this.sourceComp);

                // Move frame into position.
                frame.property("Transform").property("Anchor Point").setValue([0,0]);
                frame.property("Transform").property("Position").setValue([col * frameWidth, row * frameHeight]);

                // Shift start time so all sub-frames appear at destComp's first frame.
                frame.startTime = this.timeAtFrame(currentFrame) - this.timeAtFrame(this.config["numFrames"]["total"]);

                ++currentFrame;
            }
        }

        this.export();
        this.deleteDestComp();
    };

    /**
     * Creates the composition to which the sprite sheet will be drawn.
     * Settings such as pixel aspect and frame rate will match those of the source composition.
     */
    this.createDestComp = function()
    {
        this.destComp = app.project.items.addComp(
            config["sheetName"] + "_spritesheet",
            config["sheetPixelSize"]["width"],
            config["sheetPixelSize"]["height"],
            this.sourceComp.pixelAspect,
            this.timeAtFrame(1),
            this.sourceComp.frameRate
        );
    }

    this.deleteDestComp = function()
    {
        this.destComp.remove();
        this.destComp = null;
    }

    /**
     * Returns the time of the given frame in seconds.
     */
    this.timeAtFrame = function(frame)
    {
        return frame / this.sourceComp.frameRate;
    }

    this.export = function()
    {
        var exporter = new SheetifyExporter();
        exporter.export(this.destComp, this.config);
    }
}
