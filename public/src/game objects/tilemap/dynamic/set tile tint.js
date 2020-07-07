var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var controls;
var marker;
var map;
var shiftKey;
var selectedTile;

function preload ()
{
    this.load.image('tiles', 'assets/tilemaps/tiles/tmw_desert_spacing.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/desert.json');
}

function create ()
{
    map = this.make.tilemap({ key: 'map' });

    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    var tiles = map.addTilesetImage('Desert', 'tiles');

    // You can load a layer from the map using the layer name from Tiled ('Ground' in this case), or
    // by using the layer index. Since we are going to be manipulating the map, this needs to be a
    // dynamic tilemap layer, not a static one.
    map.createDynamicLayer('Ground', tiles, 0, 0);

    selectedTile = map.getTileAt(2, 3);

    marker = this.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    var cursors = this.input.keyboard.createCursorKeys();
    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    };
    controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

    shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    var help = this.add.text(16, 16, 'Left-click to tint.\nShift + Left-click to untint.\nArrows to scroll.', {
        fontSize: '18px',
        padding: { x: 10, y: 5 },
        backgroundColor: '#000000',
        fill: '#ffffff'
    });
    help.setScrollFactor(0);
}

function update (time, delta)
{
    controls.update(delta);

    var activePointer = this.input.activePointer;

    // Rounds down to nearest tile
    var pointerTileX = map.worldToTileX(activePointer.worldX);
    var pointerTileY = map.worldToTileY(activePointer.worldY);

    // Snap to tile coordinates, but in world space
    marker.x = map.tileToWorldX(pointerTileX);
    marker.y = map.tileToWorldY(pointerTileY);

    if (activePointer.isDown)
    {
        selectedTile = map.getTileAt(pointerTileX, pointerTileY);

        if (selectedTile)
        {
            selectedTile.tint = (shiftKey.isDown ? 0xffffff : 0xff0000);
        }
    }
}
