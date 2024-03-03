# ShakeFace

ShakeFace is a JavaScript package that provides functionality for detecting and applying filters to faces in images or video frames. It includes features such as detecting faces in images, applying filters to detected faces, and creating streams for real-time face detection and filter application.

## Installation

To install ShakeFace, you can use npm:

```bash
npm install shake-face
```

## Usage

```javascript
import ShakeFace from 'shake-face';

// Create a ShakeFace instance
const shakeFace = new ShakeFace();

// Detect faces in an image
const image = document.getElementById('imageElement');
shakeFace.detect(image)
  .then(faces => {
    // Do something with detected faces
  })
  .catch(error => {
    console.error(error);
  });

// Apply filters to detected faces
const filter = shakeFace.colorPop();
// Apply the filter to an image
const filteredImage = filter.getImage();

// Create a stream for real-time face detection
const video = document.getElementById('videoElement');
const detectionStream = shakeFace.detectStream();
video.srcObject = new MediaStream([detectionStream.readable]);

// Add filters to detected faces in a video stream
const filterStream = shakeFace.addFilterStream(filter);
const filteredVideoStream = new MediaStream([filterStream.readable]);
video.srcObject = filteredVideoStream;

// Apply filters to detected faces in a video stream
const applyFiltersStream = shakeFace.applyFiltersStream();
const appliedFiltersVideoStream = new MediaStream([applyFiltersStream.readable]);
video.srcObject = appliedFiltersVideoStream;
```

## API

### `ShakeFace(options)`

- `options` (optional): Configuration options for ShakeFace instance.
  - `maxDetectedFaces`: Maximum number of faces to detect (default: 5).
  - `fastMode`: Enable fast mode for face detection (default: false).

### `detect(image)`

Detect faces in an image.

- `image`: Image element or URL.

Returns a promise that resolves with an array of detected faces.

### `detectStream()`

Create a TransformStream for real-time face detection.

Returns a TransformStream that takes video frames as input and detects faces.

### `addFilterStream(filter)`

Create a TransformStream to add filters to detected faces in a video stream.

- `filter`: Filter to apply to detected faces.

Returns a TransformStream that adds filters to detected faces.

### `applyFiltersStream()`

Create a TransformStream to apply filters to detected faces in a video stream.

Returns a TransformStream that applies filters to detected faces.

### `colorPop()`

Apply the color pop filter to detected faces.

Returns a canvas element with the color pop filter applied.

### `track(face, options)`

Apply tracking to a detected face.

- `face`: Detected face object.
- `options` (optional): Options for tracking.
  - `stroke`: Color of the tracking outline (default: 'white').
  - `lineWidth`: Width of the tracking outline (default: 3).

### `blur(face, blurRadius)`

Apply a Gaussian blur filter to a detected face.

- `face`: Detected face object.
- `blurRadius`: Radius of the blur filter.

### `addFilter(filter, face)`

Add a filter to a detected face.

- `filter`: Filter to apply to the face.
- `face`: Detected face object.

### `applyFilter(filter, face)`

Apply a filter to a detected face.

- `filter`: Filter to apply to the face.
- `face`: Detected face object.

### `applyFilters()`

Apply filters to all detected faces.

Returns a canvas element with filters applied to all detected faces.

### `getCanvas(options)`

Create a canvas element and draw an image on it.

- `options` (optional): Options for creating the canvas and drawing the image.

Returns an object with the canvas and context.

### `setImage(imgData)`

Set the image data for processing.

- `imgData`: Image data to set.

### `getImage()`

Get the current image data.

Returns the current image data.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.