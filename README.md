
# ShakeFace

ShakeFace is a JavaScript class designed for detecting and applying filters to faces in images or video streams. It extends the functionality of a face detection library by providing additional features for real-time face tracking and filter application.

## Features

- Real-time face detection and tracking
- Applying filters to detected faces
- Support for video streams and batch processing
- Various filter options including color pop, tracking outline, and Gaussian blur

## Installation

```bash
npm install @mastashake08/shake-face
```

## Usage

```javascript
import ShakeFace from '@mastashake08/shake-face';

// Initialize ShakeFace with options

const image = document.getElementById('inputImage');
const shakeFace = new ShakeFace(image, {
    maxDetectedFaces: 5,
    fastMode: false
});

// Detect faces in an image
shakeFace.detect()
    .then(faces => {
        // Process detected faces
        faces.forEach(face => {
            // Apply filters or track faces
            shakeFace.track(face);
        });
    })
    .catch(error => {
        console.error('Error detecting faces:', error);
    });
```

For more detailed usage examples and API documentation, please refer to the [documentation](#).

## Contributing

Contributions are welcome! Feel free to open issues for bug reports, feature requests, or submit pull requests with enhancements.

## License

This project is licensed under the [MIT License](LICENSE).
