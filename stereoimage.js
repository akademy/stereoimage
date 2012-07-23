/*
The MIT License

Copyright (c) 2012 Matthew Wilcoxson (www.akademy.co.uk)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
/*
StereoImage
By Matthew Wilcoxson

Description:    Show JPS and PNS stereoscopic images inside a canvas. It can show the image in several different ways.
Website:        http://www.akademy.co.uk/software/stereoimage/
Version:        1.0.13.120724

global ImageLoader, window  (for JSLint) 
*/
function StereoImage( settings ) {
	var UNDEFINED = undefined,  // I guess I could just not define this...!
			NULL = null,
			FALSE = false,
			TRUE = true; // For minify
			
	var _setup = FALSE;
			
	var _imageName = "3DIMAGE";

    
	var displayType = ['actual_size','size_to_canvas','size_to_canvas_with_aspect']; // TODO: Minify (i.e remove strings)
	var drawType = ["bothHorizontal","bothVertical","left","right","flick","stereoscopic","anaglyph"]; // TODO: Minify (i.e remove strings)
    
    var _imgBoth = NULL;
    
    /* settings */
    var _flickSpeed = (settings['flick-rate'] !== UNDEFINED ) ? settings['flick-rate'] : 150;
    var _display = (settings['default-display-type'] !== UNDEFINED ) ? displayType[settings['default-display-type']] : displayType[2];
    var _drawing = (settings['default-draw-type'] !== UNDEFINED ) ? drawType[settings['default-draw-type']] : drawType[3];
    var _stereoscopicScale = (settings['stereoscopic-scale'] !== UNDEFINED ) ? settings['stereoscopic-scale'] : 1.0;
    
    var _canvas = settings['canvas'];
    if( _canvas === UNDEFINED && settings['canvas-id'] !== UNDEFINED ) {
    	_canvas = document.getElementById("myCanvas");
    }
    
	 if( _canvas === UNDEFINED || _canvas === NULL ) {
		 return;
	 }
	
	 // Finish setup.
    var _ctx = _canvas.getContext("2d");
    
    var _actualImageWidth = 0,
    		_actualImageHeight = 0;
    
    var flickTimer = NULL;
     
    var that = this;
    
    _setup = TRUE;
    
    
    function callDrawing( drawing ) {
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
                return alert("Missing _drawing");
        }
    }
    
    var _imageLoader = NULL;
    
    function imageLoaded() {
    	_imgBoth = _imageLoader.getImageByName( _imageName );
    	
    	_actualImageWidth = _imgBoth.width / 2;
    	_actualImageHeight = _imgBoth.height;
    	
    	_setup = TRUE;
    	
    	callDrawing( _drawing );
    }
        
	_imageLoader = new ImageLoader( {
        "images": [
            { "name":_imageName, file: settings.filename }
        ],
        "onAllLoaded": function() { imageLoaded(); },
        "onImageLoaded": function ( name, image ) {}
    });
    
    function clear() {
        if( flickTimer !== NULL ) {
            clearTimeout( flickTimer );
            flickTimer = NULL;
        }
        _ctx.clearRect( 0,0, _canvas.width, _canvas.height );
    }
    
    function sizes( display ) {
        switch( display ) {
            case 'actual_size':
                return {
                    w : _actualImageWidth,
                    h : _actualImageHeight
                };
            case 'size_to_canvas':
                return {
                    w : _canvas.width,
                    h : _canvas.height
                };
           case 'size_to_canvas_with_aspect':
                var scale = 1;
                if( _actualImageWidth > _actualImageHeight ) { // potrait
                    scale = (_canvas.width * 1.0) / _actualImageWidth;
                }
                else {
                    scale = (_canvas.height * 1.0) / _actualImageHeight;
                }
                return {
                    w : _actualImageWidth * scale,
                    h : _actualImageHeight * scale
                };
           default:
                return alert("Missing _display");
           	
        }
    }
    
    function drawLeft(context) {
        var size = sizes( _display );
        if( context === UNDEFINED ) {
            context = _ctx;
        }
            
        context.drawImage(_imgBoth,0,0,_imgBoth.width/2,_imgBoth.height,0,0,size.w,size.h);
    }
    
    function drawRight(context) {
        var size = sizes( _display );
        if( context === UNDEFINED ) {
            context = _ctx;
        }
        context.drawImage(_imgBoth,_imgBoth.width/2,0,_imgBoth.width/2,_imgBoth.height,0,0,size.w,size.h);
    }
    
    this.setFlickRate = function( flickRate ) {
    	if( flickRate > 0 ) {
		 	_flickSpeed = flickRate;
		 	
		 	if( _drawing === "flick" ) {
		 		callDrawing( _drawing );
		   }
    	}
    };
    
    this.setStereoscopicScale = function( stereoscopicScale ) {
    	if( stereoscopicScale > 0.0 && stereoscopicScale <= 1.0 ) {
		 	_stereoscopicScale = stereoscopicScale;
		 	
		 	if( _drawing === "stereoscopic" ) {
		 		callDrawing( _drawing );
		   }
    	}
    };
        
    this.setSizing = function ( size ) {
        if( size >= 0 && size < displayType.length ) {
            _display = displayType[size];
        }
        else {
            _display = displayType[0];
        }
            
        callDrawing( _drawing );
    };
    
    this.bothHorizontal = function () {
        _drawing = "bothHorizontal";
        clear();
        
        var size = sizes( _display );
        _ctx.drawImage(_imgBoth,0,0,_actualImageWidth,_actualImageHeight,0,0,size.w,size.h/2);
        _ctx.drawImage(_imgBoth,_actualImageWidth,0,_actualImageWidth,_actualImageHeight,0,size.h/2,size.w,size.h/2);
    };

    this.bothVertical = function() {
        _drawing = "bothVertical";
        clear();

        var size = sizes( _display );
        _ctx.drawImage(_imgBoth,0,0,_imgBoth.width, _imgBoth.height,0,0,size.w, size.h );
        
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
        var showingLeft = TRUE;
        drawRight();

        flickTimer = setInterval( function() {
            if( showingLeft ) {
                drawLeft();
            }
            else {
                drawRight();
            }
            showingLeft = !showingLeft;
        }, _flickSpeed );

    };
    
    this.stereoscopic = function() {
        _drawing = "stereoscopic";
        
        // TODO: crop image and possibly scroll to make combining easier...
        
        var size = sizes( _display );
        
        var dotRadius = 3;
        var dotPosY = dotRadius*3;
        var imagePosY = dotPosY * 2;
        
        size.h -= imagePosY;
        
        size.w *= _stereoscopicScale;
        
        // Overwrite height for this setting so that the aspect is always correct.
        var scale = (size.w*1.0) / _imgBoth.width;
        size.h = _imgBoth.height * scale;
                
        clear();
        
        // Helper to align images with eyes
        _ctx.fillStyle="black";
        _ctx.beginPath();
        _ctx.arc(size.w/4,dotPosY,dotRadius,0,Math.PI*2, TRUE);
        _ctx.arc(size.w*3/4,dotPosY,dotRadius,0,Math.PI*2, TRUE);
        _ctx.fill();
        
        _ctx.drawImage(_imgBoth,0,0,_imgBoth.width, _imgBoth.height,0,imagePosY,size.w, size.h );
    };
    
    this.anaglyph = function() {
        //http://axon.physik.uni-bremen.de/research/stereo/color_anaglyph/
        
        _drawing = "anaglyph";
        
        var size = sizes( _display );
        
        var buffer = document.createElement('canvas');
        buffer.width = size.w;
        buffer.height = size.h;
        
        var ctxBuffer = buffer.getContext("2d");
        
        drawLeft( ctxBuffer );
        var red = ctxBuffer.getImageData( 0,0, size.w, size.h);
        
        drawRight( ctxBuffer );
        var greenblue = ctxBuffer.getImageData( 0,0, size.w, size.h);
        
        var dataWidth = greenblue.width,
            dataHeight = greenblue.height,
            h_line = 0,
            pos = 0, 
            h=0, w=0;
            
        for( ; h < dataHeight; h++ ) {
        		h_line = h * dataWidth;
            for( w=0; w < dataWidth; w++ ) {
            	pos = ( h_line + w ) * 4;
               greenblue.data[pos] = red.data[pos];
            }
        }
        
        clear();
        _ctx.putImageData( greenblue, 0, 0 );
        
    };
};
    
StereoImage.prototype.toString = function() {
    return "StereoImage class";
};
