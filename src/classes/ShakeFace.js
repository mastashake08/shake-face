import Canvas from "./Canvas";
export default class ShakeFace extends FaceDetector {
    #image;
    constructor(options = {
        maxDetectedFaces: 5,
        fastMode: false
    }) {
        super(options);
        // a map that will hold the faces and the changes made
        this.faceFilters = new Map();
        
    }

    // override the parent detect function and set the faces in the filters map
    async detect(image) {
        try {
            
            const faces = await super.detect(this.setImage(image));
            for(const face of faces) {
                this.addNewFace(face);
            }
            return faces;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * 
     * @returns a TransformStream that takes videoFrames and detects faces. Set up for other transformations
     */
     detectStream() {
        return new TransformStream({
            async transform(videoFrame, controller) {
                this.setImage(videoFrame);
                await this.detect(videoFrame);
                controller.enqueue(videoFrame);
            }
        });
    }

    addFilterStream(filter) {
        return new TransformStream({
             transform(videoFrame, controller) {
                this.addFilter(filter, videoFrame);
                controller.enqueue(videoFrame);
            }
        });
    }

    applyFiltersStream(filter) {
        return new TransformStream({
             transform(videoFrame, controller) {
                const img = this.applyFilters();
                controller.enqueue(img);
            }
        });
    }

    // adds a new face to the image map 
    addNewFace(face) {
        try {
            this.faceFilters.set(face, []);  
        } catch (error) {
            console.log(error);
        }
    }

    /*
    *
    * Filter Functions
    */

    /* 
    * The color pop filter makes the background greyscale and leaves the faces colored
    */
    colorPop() {
        const image = this.getImage();
        const { bgCanvas, bgCtx} = this.getCanvas({
            image: image, 
            width: image.width, 
            height: image.height
        });
        bgCanvas.filter = 'grayscale(100%)';

        const { retCanvas,retCtx} = this.getCanvas({
            image: bgCanvas, 
            width: bgCanvas.width, 
            height: bgCanvas.height
        });

        const faces = this.faceFilters.keys();
        for(const face of faces) {
            const {canvas, ctx} = this.getCanvas({
                image: image,
                x: face.boundingBox.x,
                y: face.boundingBox.y,
                width: face.boundingBox.width,
                height: face.boundingBox.height
            });

            retCanvas.drawImage(canvas, face.boundingBox.x, face.boundingBox.y)
        }
        
        return retCanvas;

    }

        /**
         *
         * @param {*} face 
         * @param {*} param1 
         */
    track(face, {
        stroke = 'white',
        lineWidth = '3'
    }) {
        // Create an SVG element
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", face.boundingBox.width);
        svg.setAttribute("height", face.boundingBox.height);

        // Define filters in the SVG
        const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        filter.setAttribute("id", "trackFilter");
        svg.appendChild(filter);

        const feMorphology = document.createElementNS("http://www.w3.org/2000/svg", "feMorphology");
        feMorphology.setAttribute('radius', lineWidth);
        feMorphology.setAttribute('operator', 'dilate');
        filter.appendChild(feMorphology);

        const feFlood = document.createElementNS("http://www.w3.org/2000/svg", "feFlood");
        feFlood.setAttribute('flood-color', stroke);
        feFlood.setAttribute('result', 'outlineColor');
        filter.appendChild(feFlood);

        const feComposite = document.createElementNS("http://www.w3.org/2000/svg", "feComposite");
        feComposite.setAttribute("in", "outlineColor");
        feComposite.setAttribute("in2", "SourceGraphic");
        feComposite.setAttribute("operator", "in");
        filter.appendChild(feComposite);

      

        // Convert SVG to data URL
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const svgUrl = URL.createObjectURL(svgBlob);

        this.addFilter(`url('${svgUrl}#trackFilter')`, face);

    }
// Function to apply a Gaussian blur filter to content drawn on a canvas
    blur(face, blurRadius) {
        // Create an SVG element
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", face.boundingBox.width);
        svg.setAttribute("height", face.boundingBox.height);

        // Define the Gaussian blur filter in the SVG
        var filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        filter.setAttribute("id", "blurFilter");
        filter.innerHTML = '<feGaussianBlur stdDeviation="' + blurRadius + '" />';
        svg.appendChild(filter);

        // Convert SVG to data URL
        var svgData = new XMLSerializer().serializeToString(svg);
        var svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        var svgUrl = URL.createObjectURL(svgBlob);

        this.addFilter(`url('${svgUrl}#blurFilter')`, face);
    }


    addFilter(filter, face) {
        try {
            const filters = this.faceFilters.get(face);
            this.faceFilters.set(face, filters.push(filter));
        } catch (error) {
            console.log(error);
        }
    }

    applyFilter(filter, face) {
        try {
            const image = this.getImage();
            const {imgCanvas, imgCtx} = this.getCanvas({image: image, width: image.width, height: image.height});
    
            const faceData = imgCtx.getImageData(face.boundingBox.x, face.boundingBox.y, face.boundingBox.width, face.boundingBox.height);
            const {faceCanvas, faceCtx} = this.getCanvas({
                image: faceData, 
                width: face.boundingBox.width, 
                height: face.boundingBox.height
            });
            faceCanvas.filter = filter;
    
            imgCtx.putImageData(faceCtx.getImageData(0, 0, faceCanvas.width, faceCanvas.height));
            return imgCanvas;
        } catch (error) {
            console.log(error);
        }
    }
    applyFilters() {
        for(const [face, filters] of this.faceFilters) {
            filters.forEach((filter) => {
                this.setImage(this.applyFilter(filter, face));
            });
        }
    }

    getCanvas({image = this.getImage(), x = 0, y = 0, width = image.width, height = image.height}) {
        const canvas = Canvas.create();
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, x, y);

        return {
            canvas,
            ctx
        };
    }
    setImage(imgData) {
        try {
            this.#image = imgData;
            return this.getImage();
        } catch (error) {
            console.log(error);
        }
    }

    getImage() {
        return this.#image;
    }

   

    

 
}