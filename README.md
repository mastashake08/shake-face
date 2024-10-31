# ShakeFace

**ShakeFace** is a JavaScript library that leverages facial detection and image processing to apply custom filters to detected faces in images or video streams. It builds upon the native `FaceDetector` API, providing real-time face detection and a suite of customizable filter options.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Initialization](#initialization)
  - [Real-Time Detection](#real-time-detection)
  - [Applying Filters](#applying-filters)
  - [Custom Events](#custom-events)
- [API Reference](#api-reference)
  - [ShakeFace](#shakeface)
  - [ShakeFaceEvent](#shakefaceevent)
- [Examples](#examples)
- [License](#license)

## Features

- **Real-time face detection**: Detect faces in images or video streams using custom `TransformStreams`.
- **Filter Application**: Apply a range of filters to detected faces, such as color pop, tracking outlines, Gaussian blur, and face replacement.
- **Event Handling**: Use `ShakeFaceEvent` for custom event management.

## Installation

To use ShakeFace, install the package via npm:

```bash
npm install @mastashake08/shake-face
```

## Usage

### Initialization

```javascript
import ShakeFace from '@mastashake08/shake-face';

const imageElement = document.getElementById('myImage'); // or any HTMLImageElement
const shakeFace = new ShakeFace(imageElement, {
    maxDetectedFaces: 5,
    fastMode: false
});
```

### Real-Time Detection

You can detect faces in real time using `detectStream()` for live face detection or `addFilterStream()` to apply filters directly on video frames.

```javascript
const detectStream = ShakeFace.detectStream();
const filterStream = shakeFace.addFilterStream('colorPop');
```

### Applying Filters

ShakeFace allows you to apply several built-in filters:

- **Color Pop**: Makes the background grayscale, keeping faces in color.
- **Tracking Outline**: Adds an outline around detected faces.
- **Gaussian Blur**: Blurs detected faces.
- **Face Replacement**: Replaces a detected face with a provided image.

```javascript
shakeFace.colorPop(imageElement);
shakeFace.track(face, { stroke: 'blue', lineWidth: 4 });
shakeFace.blur(face, 10);
shakeFace.replace(face, replacementImage);
```

### Custom Events

`ShakeFaceEvent` allows handling custom events, which is useful for handling errors or other states in the face detection process.

```javascript
shakeFace.addEventListener('error', (event) => {
    console.error('ShakeFace error:', event.data);
});
```

## API Reference

### ShakeFace

#### `constructor(image, options)`

- **`image`**: `HTMLImageElement` to be used for face detection.
- **`options`**: Configuration options for face detection.

#### `detect(image)`

Detects faces in the provided image and adds them to the `faceFilters` map.

#### `detectStream()`

Returns a `TransformStream` for real-time face detection on video frames.

#### `addFilterStream(filter)`

Applies the specified filter to faces in a video stream.

### ShakeFaceEvent

Custom event class for handling ShakeFace-related events.

#### `constructor(type, eventData, options)`

- **`type`**: Type of event.
- **`eventData`**: Additional data for the event.
- **`options`**: Options for the event.

## Examples

Apply a color pop filter to an image:

```javascript
shakeFace.colorPop();
```

Track a face in an image:

```javascript
shakeFace.track(face, { stroke: 'green', lineWidth: 2 });
```

Blur a detected face:

```javascript
shakeFace.blur(face, 5);
```

## License

MIT License

---

This README outlines the primary functions, installation instructions, and basic usage examples, providing a foundational reference for the ShakeFace library. Let me know if you’d like to add more specific details!
