StereoImageCanvas
==========

Here we show jps and pns stereoscopic images inside a canvas. It can show the image in several different ways. This uses the open source MIT license, use it as you see fit (but an attribution would be appreciated!).

It should work on Opera, Firefox, Chrome, Safari and IE9; and any other browser which supports the HTML5 2D canvas.


Description
-----------

This can show the 3D image formats of JPS and PNS in a 2D canvas in various different ways:
1 View the left image individually.
2 View the right image individually.
3 View the left and right similtaneously on the top and bottom.
4 View the left and right similtaneously on the left and right.
5 Flick between the left and the right image.
6 Show steroscopically so that the images can be combined by "crossing" the eyes.
7 Show an anaglyph red-cyan image to use with coloured glasses.


Use
---

You need a JPS or PNS file, which are steroscopic images (which basically mean two jpegs or pngs next to each other in the same image):

   1. Add the Canvas element and the JavaScript to your webpage,  (you'll also need to include the imageloader.min.js file from [here](https://bitbucket.org/akademy/imageloader) )

	<pre>
		&lt;canvas id="myCanvas" width="800" height="700" style="border:1px solid #c3c3c3;">
		Your browser does not support the canvas element.
		&lt;/canvas>
		&lt;script type="text/javascript" src="imageloader.min.js">&lt;/script>
		&lt;script type="text/javascript" src="stereoimage.js">&lt;/script>
	</pre>

   2. Now call the StereoImage class to do it's stuff with a little Javascript:

   <pre>
		&lt;script type="text/javascript">
			var settings = {
				'canvas-id' : "myCanvas",
				'filename' : 'test-image.jps',
				'default-display-type' : 2,
				'default-draw-type' : 6
				'stereoscopic-scale' : 0.45,
				'flick-rate' : 280,
				}
			var stereoImage = new StereoImage( settings );
		&lt;/script>
   </pre>

   The StereoImage class understands these settings: 

* 'canvas-id' : Compulsory. The canvas you want to use.
* 'filename' : Compulsory. The name of the image to load.
* 'default-display-type' : Optional. The startup type of display to show, 0, to 2, defaults to 2.
* 'default-draw-type' : Optional. The startup type of drawing to use, 0 to 6, defaults to 3.
* 'stereoscopic-scale' : Optional. The amount to scale the stereoscopic drawing.
* 'flick-rate' : Optional. The time in millisceonds before switching to the other image in flick draw mode.

   3. If you'd like the ability to switch between options you'll have to create some HTML controls. If adapting the above code they could look similar to (though you need not inlucde all these):
	<pre>
		&lt;input type="button" onclick="stereoImage.bothHorizontal();" value="Draw: Horizontal" />
		&lt;input type="button" onclick="stereoImage.bothVertical();" value="Draw: Vertical" />
		&lt;input type="button" onclick="stereoImage.left();" value="Draw: Left" />
		&lt;input type="button" onclick="stereoImage.right();" value="Draw: Right" />
		&lt;input type="button" onclick="stereoImage.flick();" value="Draw: Flick" />
		&lt;input type="button" onclick="stereoImage.stereoscopic();" value="Draw: Stereoscopic" />
		&lt;input type="button" onclick="stereoImage.anaglyph();" value="Draw: Anaglyph" />
		&lt;input id="stereoscopicScale" type="text" value="0.45" />
		&lt;input type="button" onclick="stereoImage.setStereoscopicScale(document.getElementById('stereoscopicScale').value);" value="Set Stereoscopic Scale" />
		&lt;input id="flickRate" type="text" value="280" />
		&lt;input type="button" onclick="stereoImage.setFlickRate(document.getElementById('flickRate').value);" value="Set Flick Rate" />
		&lt;input type="button" onclick="stereoImage.setSizing(0);" value="Sizing: full" />
		&lt;input type="button" onclick="stereoImage.setSizing(1);" value="Sizing: fill" />
		&lt;input type="button" onclick="stereoImage.setSizing(2);" value="Sizing: aspect fill" />
	</pre>
	
Examples
---------
Mine:

 * https://bitbucket.org/akademy/stereoimage/downloads
 * http://www.akademy.co.uk/software/stereoimage/



