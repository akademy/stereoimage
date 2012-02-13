function StereoImage( image ) {
    var imgBoth = image;
    
    var displayType = ['actual_size','size_to_canvas','size_to_canvas_with_aspect'];
    var drawType = ["bothHorizontal","bothVertical","left","right","flick"];
    
    /* settings */
    var flickSpeed = 150;
    var display = displayType[2];
    var  drawing = drawType[2];
    
    var c = document.getElementById("myCanvas");
    var cxt = c.getContext("2d");
                
    var actualImageWidth = imgBoth.width / 2;
    var actualImageHeight = imgBoth.height;

    var flickTimer = null;
    
    var left;
    
    function callDrawing( that, drawing ) {
        switch( drawing ) {
            case( "bothHorizontal" ):
                return  that.bothHorizontal();
            case( "bothVertical" ):
                return that.bothVertical();
            case( "left" ):
                return that.left();
            case( "right" ):
                return that.right();
            case( "flick" ):
                return that.flick();
        }
    }
    
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

    this.setSizing = function ( size ) {
        if( size >= 0 && size < displayType.length )
            display = displayType[size];
        else
            display = displayType[0];
            
        callDrawing( this, drawing );
    }
    
    this.bothHorizontal = function () {
        drawing = "bothHorizontal";
        clear();
        
        var size = sizes( display );
        cxt.drawImage(imgBoth,0,0,imgBoth.width, imgBoth.height,0,0,size.w, size.h );
    };

    this.bothVertical = function() {
        drawing = "bothVertical";
        clear();

        var size = sizes( display );
        cxt.drawImage(imgBoth,0,0,actualImageWidth,actualImageHeight,0,0,size.w,size.h/2);
        cxt.drawImage(imgBoth,actualImageWidth,0,actualImageWidth,actualImageHeight,0,size.h/2,size.w,size.h/2);
    };

    this.left = function() {
        drawing = "left";
        clear();
        var size = sizes( display );
        cxt.drawImage(imgBoth,0,0,imgBoth.width/2,imgBoth.height,0,0,size.w,size.h);
    };
    this.right = function() {
        drawing = "right";
        clear();
        var size = sizes( display );
        cxt.drawImage(imgBoth,imgBoth.width/2,0,imgBoth.width/2,imgBoth.height,0,0,size.w,size.h);
    };

    this.flick = function() {
        drawing = "flick";
        
        clear();
        
        var size = sizes( display );
        var showingLeft = true;
        cxt.drawImage(imgBoth,imgBoth.width/2,0,imgBoth.width/2,imgBoth.height,0,0,size.w,size.h);

        flickTimer = setInterval( function() {
            if( showingLeft ) {
                cxt.drawImage(imgBoth,0,0,imgBoth.width/2,imgBoth.height,0,0,size.w,size.h);
            }
            else {
                cxt.drawImage(imgBoth,imgBoth.width/2,0,imgBoth.width/2,imgBoth.height,0,0,size.w,size.h);
            }
            showingLeft = !showingLeft;
        }, flickSpeed );

    };
    
    this.left();
};
    
    
StereoImage.prototype.toString = function() {
    return "StereoImage class";
};