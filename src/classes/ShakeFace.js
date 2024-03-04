import ShakeCanvas from "@mastashake08/shake-canvas";
import ShakeFaceEvent from "./ShakeFaceEvent";
/**
 * ShakeFace class for detecting and applying filters to faces.
 * @extends FaceDetector
 */
export default class ShakeFace extends FaceDetector {
    #_image;

    /**
     * Constructs a new ShakeFace instance.
     * @param {Object} options - Configuration options.
     * @param {number} options.maxDetectedFaces - Maximum number of faces to detect (default: 5).
     * @param {boolean} options.fastMode - Enable fast mode for face detection (default: false).
     */
    constructor(image, options = {
        maxDetectedFaces: 5,
        fastMode: false
    }) {
        super(options);
        // a map that will hold the faces and the changes made
        this.faceFilters = new Map();

        this.setImage(image);
    }

    constructor(options = {
        maxDetectedFaces: 5,
        fastMode: false
    }) {
        super(options);
        // a map that will hold the faces and the changes made
        this.faceFilters = new Map();

    }

    /**
     * Override the parent detect function and set the faces in the filters map.
     * @param {HTMLImageElement} image - The image to detect faces in.
     * @returns {Promise<Array>} - Promise resolving with an array of detected faces.
     */
    
    async detect(image = this.getImage()) {
        try {
            const faces = await super.detect(image);
            for(const face of faces) {
                this.addNewFace(face);
            }
            return faces;
        } catch (error) {
            throw new ShakeFaceEvent('error', this);
        }
    }

    /**
     * Creates a TransformStream for real-time face detection.
     * @returns {TransformStream} - TransformStream that takes video frames and detects faces.
     */
    static detectStream() {
        return new TransformStream({
            async transform(videoFrame, controller) {
                const faces = await this.detect(videoFrame);
                const frameWithFaces = {
                    faces: faces,
                    frame: videoFrame
                };
                controller.enqueue(frameWithFaces);
            }
        });
    }

    /**
     * Creates a TransformStream to add filters to detected faces in a video stream.
     * @param {string} filter - Filter to apply to detected faces.
     * @returns {TransformStream} - TransformStream that adds filters to detected faces.
     */
    addFilterStream(filter) {
        return new TransformStream({
             transform(videoFrame, controller) {
                this.addFilter(filter, videoFrame);
                controller.enqueue(videoFrame);
            }
        });
    }

    /**
     * Creates a TransformStream to apply filters to detected faces in a video stream.
     * @param {string} filter - Filter to apply to detected faces.
     * @returns {TransformStream} - TransformStream that applies filters to detected faces.
     */
    applyFiltersStream(filter) {
        return new TransformStream({
             transform(videoFrame, controller) {
                const img = this.applyFilters();
                controller.enqueue(img);
            }
        });
    }

    /**
     * Adds a new face to the image map.
     * @param {Object} face - Detected face object.
     */
    addNewFace(face) {
        try {
            this.faceFilters.set(face, []);  
        } catch (error) {
            throw new ShakeFaceEvent('error', this);
        }
    }

    // Filter Functions

    /**
     * The color pop filter makes the background greyscale and leaves the faces colored.
     * @returns {ShakeCanvas} - Canvas element with the color pop filter applied.
     */
    colorPop(image = this.getImage()) {
        
        const bgCanvas = this.getCanvas({
            image: image, 
            width: image.width, 
            height: image.height
        });
        const bgCtx = bgCanvas.getContext("2d");
        bgCanvas.filter = 'grayscale(100%)';

        const retCanvas = this.getCanvas({
            image: bgCanvas, 
            width: bgCanvas.width, 
            height: bgCanvas.height
        });
        const retCtx = retCanvas.getContext("2d");

        const faces = this.faceFilters.keys();
        for(const face of faces) {
            const canvas = this.getCanvas({
                image: image,
                x: face.boundingBox.x,
                y: face.boundingBox.y,
                width: face.boundingBox.width,
                height: face.boundingBox.height
            });
            const ctx = canvas.getContext("2d");
            retCtx.drawImage(canvas, face.boundingBox.x, face.boundingBox.y)
        }
        
        return retCanvas;
    }

    /**
     * Track a detected face and apply a tracking outline.
     * @param {Object} face - Detected face object.
     * @param {Object} options - Options for tracking.
     * @param {string} options.stroke - Color of the tracking outline (default: 'white').
     * @param {number} options.lineWidth - Width of the tracking outline (default: 3).
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

    /**
     * Apply a Gaussian blur filter to a detected face.
     * @param {Object} face - Detected face object.
     * @param {number} blurRadius - Radius of the blur filter.
     */
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

        this.addFilter(`

url('${svgUrl}#blurFilter')`, face);
    }

    /**
     * Replace a detected face with a given image.
     * @param {Object} face - Detected face object.
     * @param {HTMLImageElement} image - Image to replace the face with.
     * @returns {ImageData} - Base image after replacement.
     */
    replace(face, image) {
        const baseImage = this.getImage();
        const bgCanvas = this.getCanvas({
            image: baseImage, 
            width: baseImage.width, 
            height: baseImage.height
        });
        const bgCtx = bgCanvas.getContext("2d");
        image.width = face.boundingBox.width;
        image.height = face.boundingBox.height;
        bgCtx.drawImage(image, face.boundingBox.x, face.boundingBox.y); 
        return this.setImage(bgCtx.getImageData(0,0, bgCanvas.width, bgCanvas.height));
    }

    /**
     * Adds a filter to a detected face.
     * @param {string} filter - Filter to apply to the face.
     * @param {Object} face - Detected face object.
     */
    addFilter(filter, face) {
        try {
            const filters = this.faceFilters.get(face);
            this.faceFilters.set(face, filters.push(filter));
        } catch (error) {
            throw new ShakeFaceEvent('error', this);
        }
    }

    /**
     * Apply a filter to a detected face.
     * @param {string} filter - Filter to apply to the face.
     * @param {Object} face - Detected face object.
     * @returns {ShakeCanvas} - Canvas element with the filter applied.
     */
    applyFilter(filter, face) {
        try {
            const image = this.getImage();
            const imgCanvas = this.getCanvas({image: image, width: image.width, height: image.height});
            const imgCtx = imgCanvas.getContext("2d");
            const faceData = imgCtx.getImageData(face.boundingBox.x, face.boundingBox.y, face.boundingBox.width, face.boundingBox.height);
            const faceCanvas = this.getCanvas({
                image: faceData, 
                width: face.boundingBox.width, 
                height: face.boundingBox.height
            });
            const faceCtx = faceCanvas.getContext("2d");
            faceCanvas.filter = filter;
    
            imgCtx.putImageData(faceCtx.getImageData(0, 0, faceCanvas.width, faceCanvas.height));
            return imgCanvas;
        } catch (error) {
            throw new ShakeFaceEvent('error', this);
        }
    }

    /**
     * Apply filters to all detected faces.
     */
    applyFilters() {
        for(const [face, filters] of this.faceFilters) {
            filters.forEach((filter) => {
                this.setImage(this.applyFilter(filter, face));
            });
        }
    }

    // Image and Canvas Methods

    /**
     * Create a canvas element and draw an image on it.
     * @param {Object} options - Options for creating the canvas and drawing the image.
     * @param {HTMLImageElement} [options.image=this.getImage()] - Image to draw on the canvas.
     * @param {number} [options.x=0] - X-coordinate of the image on the canvas.
     * @param {number} [options.y=0] - Y-coordinate of the image on the canvas.
     * @param {number} [options.width=image.width] - Width of the canvas.
     * @param {number} [options.height=image.height] - Height of the canvas.
     * @returns {Object} - Object with the canvas and context.
     */
    getCanvas({image = this.getImage(), x = 0, y = 0, width = image.width, height = image.height}) {
        const canvas = ShakeCanvas.create(width, height);
        
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, x, y);

        return canvas;
    }

    /**
     * Set the image data for processing.
     * @param {ImageData} imgData - Image data to set.
     * @returns {ImageData} - The updated image data.
     */
    setImage(imgData) {
        try {
            this.#_image = imgData;
            return this.getImage();
        } catch (error) {
            throw new ShakeFaceEvent('error', this);
        }
    }

    /**
     * Get the current image data.
     * @returns {ImageData} - The current image data.
     */
    getImage() {
        return this.#_image;
    }
}
