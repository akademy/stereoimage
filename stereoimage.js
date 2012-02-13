function StereoImage( image ) {
    var imgBoth = image;
    
    var displayType = ['actual_size','size_to_canvas','size_to_canvas_with_aspect'];

    /* settings */
    var flickSpeed = 150;
    var display = displayType[0];
    
    var c = document.getElementById("myCanvas");
    var cxt = c.getContext("2d");
                
    var actualImageWidth = imgBoth.width / 2;
    var actualImageHeight = imgBoth.height;

    var flickTimer = null;
    
    function clear() {
        if( flickTimer != null ) {
            clearTimeout( flickTimer );
            flickTimer = null;
        }
        cxt.clearRect( 0,0, c.width, c.height );
    };

    /* TODO: test sizing */
    function sizes( display ) {
        switch( display ) {
            case 'actual_size':
            default:
                return {
                    w : actualImageWidth,
                    h : actualImageHeight
                };
            case 'size_to_canvas':
                return {
                    w : c.width,
                    h : c.height
                };
           case 'size_to_canvas_with_aspect':
                if( actualImageWidth > actualImageHeight ) {
                    // potrait
                    var scale = (c.width * 1.0) / actualImageWidth;
                    return {
                        w : actualImageWidth * scale,
                        h : actualImageHeight * scale
                    };
                }
                else {
                    var scale = (c.height * 1.0) / actualImageHeight;
                    return {
                        w : actualImageWidth * scale,
                        h : actualImageHeight * scale
                    };
                }
        }
    };

    this.bothHorizontal = function () {
        clear();

        cxt.drawImage(imgBoth,0,0,imgBoth.width, imgBoth.height,0,0,actualImageWidth, actualImageHeight);
    };

    this.bothVertical = function() {
        clear();

        cxt.drawImage(imgBoth,0,0,actualImageWidth,actualImageHeight,0,0,actualImageWidth,actualImageHeight/2);
        cxt.drawImage(imgBoth,actualImageWidth,0,actualImageWidth,actualImageHeight,0,actualImageHeight/2,actualImageWidth,actualImageHeight/2);
    };

    this.left = function() {
        clear();
        cxt.drawImage(imgBoth,0,0,imgBoth.width/2,imgBoth.height,0,0,imgBoth.width/2,imgBoth.height);
    };
    this.right = function() {
        clear();
        cxt.drawImage(imgBoth,imgBoth.width/2,0,imgBoth.width/2,imgBoth.height,0,0,imgBoth.width/2,imgBoth.height);
    };

    this.flick = function() {
        clear();

        var showingLeft = true;
        cxt.drawImage(imgBoth,imgBoth.width/2,0,imgBoth.width/2,imgBoth.height,0,0,imgBoth.width/2,imgBoth.height);

        flickTimer = setInterval( function() {
            if( showingLeft ) {
                cxt.drawImage(imgBoth,0,0,imgBoth.width/2,imgBoth.height,0,0,imgBoth.width/2,imgBoth.height);
            }
            else {
                cxt.drawImage(imgBoth,imgBoth.width/2,0,imgBoth.width/2,imgBoth.height,0,0,imgBoth.width/2,imgBoth.height);
            }
            showingLeft = !showingLeft;
        }, flickSpeed );

    };
};
    
    
StereoImage.prototype.toString = function() {
    return "StereoImage class";
};