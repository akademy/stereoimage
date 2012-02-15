function StereoImage( image ) {
    var imgBoth = image;
    
    var displayType = ['actual_size','size_to_canvas','size_to_canvas_with_aspect'];
    var drawType = ["bothHorizontal","bothVertical","left","right","flick","stereoscopic","anaglyph"];
    
    /* settings */
    var flickSpeed = 150;
    var _display = displayType[0];
    var  _drawing = drawType[3];
    
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
                
    var actualImageWidth = imgBoth.width / 2;
    var actualImageHeight = imgBoth.height;

    var flickTimer = null;
    
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
            case( "stereoscopic" ):
                return that.stereoscopic();
            case( "anaglyph" ):
                return that.anaglyph();
            default:
                alert("Missing _drawing");
        }
    }
    
    function clear() {
        if( flickTimer != null ) {
            clearTimeout( flickTimer );
            flickTimer = null;
        }
        ctx.clearRect( 0,0, c.width, c.height );
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
                var scale = 1;
                if( actualImageWidth > actualImageHeight ) { // potrait
                    scale = (c.width * 1.0) / actualImageWidth;
                }
                else {
                    scale = (c.height * 1.0) / actualImageHeight;
                }
                return {
                    w : actualImageWidth * scale,
                    h : actualImageHeight * scale
                };
        }
    };
    
    function drawLeft(context) {
        var size = sizes( _display );
        if( context === undefined )
            context = ctx;
            
        context.drawImage(imgBoth,0,0,imgBoth.width/2,imgBoth.height,0,0,size.w,size.h);
    };
    
    function drawRight(context) {
        var size = sizes( _display );
        if( context === undefined )
            context = ctx;
        context.drawImage(imgBoth,imgBoth.width/2,0,imgBoth.width/2,imgBoth.height,0,0,size.w,size.h);
    };
    
    this.setSizing = function ( size ) {
        if( size >= 0 && size < displayType.length )
            _display = displayType[size];
        else
            _display = displayType[0];
            
        callDrawing( this, _drawing );
    }
    
    this.bothHorizontal = function () {
        _drawing = "bothHorizontal";
        clear();
        
        var size = sizes( _display );
        ctx.drawImage(imgBoth,0,0,imgBoth.width, imgBoth.height,0,0,size.w, size.h );
    };

    this.bothVertical = function() {
        _drawing = "bothVertical";
        clear();

        var size = sizes( _display );
        ctx.drawImage(imgBoth,0,0,actualImageWidth,actualImageHeight,0,0,size.w,size.h/2);
        ctx.drawImage(imgBoth,actualImageWidth,0,actualImageWidth,actualImageHeight,0,size.h/2,size.w,size.h/2);
    };

    this.left = function() {
        _drawing = "left";
        clear();
        
        drawLeft();
    };
    this.right = function() {
        _drawing = "right";
        clear();
        
        drawRight();
    };

    this.flick = function() {
        _drawing = "flick";
        
        clear();
        
        var size = sizes( _display );
        var showingLeft = true;
        drawRight();

        flickTimer = setInterval( function() {
            if( showingLeft ) {
                drawLeft();
            }
            else {
                drawRight();
            }
            showingLeft = !showingLeft;
        }, flickSpeed );

    };
    
    this.stereoscopic = function() {
        _drawing = "stereoscopic";
        
        // TODO: reduce image size for easier combination, may also crop image and possibly scroll...
        
        var size = sizes( _display );
        
        var dotRadius = 3;
        var dotPosY = dotRadius*3;
        var imagePosY = dotPosY * 2;
        
        size.h -= imagePosY;
        
        clear();
        
        // Overright height for this setting so that the aspect is always correct.
        var scale = (size.w*1.0) / imgBoth.width;
        size.h = imgBoth.height * scale;
        
        // Helper to align eyes
        ctx.fillStyle="black";
        ctx.beginPath();
        ctx.arc(size.w/4,dotPosY,dotRadius,0,Math.PI*2, true);
        ctx.arc(size.w*3/4,dotPosY,dotRadius,0,Math.PI*2, true);
        ctx.fill();
        
        ctx.drawImage(imgBoth,0,0,imgBoth.width, imgBoth.height,0,imagePosY,size.w, size.h );
    }
    
    this.anaglyph = function() {
        _drawing = "anaglyph";
        
        // TODO: reduce image size for easier combination, may also crop image and possibly scroll...
        
        var size = sizes( _display );
        
        var leftBuffer = document.createElement('canvas');
        var rightBuffer = document.createElement('canvas');
        
        leftBuffer.width =  rightBuffer.width = size.w;//actualImageWidth;
        leftBuffer.height = rightBuffer.height = size.h;//actualImageHeight;
        
        var ctxLeft = leftBuffer.getContext("2d");
        var ctxRight = rightBuffer.getContext("2d");
        
        drawLeft( ctxLeft );
        drawRight( ctxRight );
        
        //http://axon.physik.uni-bremen.de/research/stereo/color_anaglyph/
        red = ctxLeft.getImageData( 0,0, size.w, size.h);
        greenblue = ctxLeft.getImageData( 0,0, size.w, size.h);
        
        for( var h=0;h<greenblue.height;h++) {
            for( var w=0; w < greenblue.width;w++ ) {
                greenblue.data[(h*greenblue.width + w ) * 4 + 0] = 0;
            }
        }
        
        ctx.putImageData( greenblue,0,0);
    };
    
    callDrawing( this, _drawing );
};
    
    
StereoImage.prototype.toString = function() {
    return "StereoImage class";
};