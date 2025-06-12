# ShakeFace

**ShakeFace** is a JavaScript library for real-time face detection and creative face filtering in images and video streams. Built on top of the native `FaceDetector` API, ShakeFace makes it easy to apply custom filters, effects, and face replacements with a simple, modern API.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Initialization](#initialization)
  - [Real-Time Detection](#real-time-detection)
  - [Applying Filters](#applying-filters)
  - [Custom Events](#custom-events)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Social Media](#social-media)
- [License](#license)

---

## Features

- **Real-time face detection** using the browser's FaceDetector API.
- **Flexible filter application**: Color pop, tracking outlines, Gaussian blur, face replacement, and more.
- **Stream support**: Use with video streams via `TransformStream`.
- **Custom event handling** for robust error and state management.
- **Easy integration** with modern JavaScript projects.

---

## Installation

Install ShakeFace via npm:

```bash
npm install @mastashake08/shake-face
```

---

## Usage

### Initialization

```javascript
import ShakeFace from '@mastashake08/shake-face';

const imageElement = document.getElementById('myImage');
const shakeFace = new ShakeFace(imageElement, {
    maxDetectedFaces: 5,
    fastMode: false
});
```

### Real-Time Detection

Detect faces in real time from a video stream:

```javascript
const detectStream = ShakeFace.detectStream();
const filterStream = shakeFace.addFilterStream('colorPop');
```

### Applying Filters

Apply built-in filters to detected faces:

```javascript
shakeFace.colorPop(imageElement); // Background grayscale, faces in color
shakeFace.track(face, { stroke: 'blue', lineWidth: 4 }); // Outline
shakeFace.blur(face, 10); // Blur face
shakeFace.replace(face, replacementImage, true); // Replace face, keep eyes/mouth
```

### Custom Events

Handle errors and custom events:

```javascript
shakeFace.addEventListener('error', (event) => {
    console.error('ShakeFace error:', event.data);
});
```

---

## API Reference

### ShakeFace

#### `constructor(image, options)`

- `image`: `HTMLImageElement` for face detection (optional).
- `options`: `{ maxDetectedFaces, fastMode }` (optional).

#### `detect(image)`

Detects faces in the provided image and adds them to the `faceFilters` map.

#### `detectStream()`

Returns a `TransformStream` for real-time face detection on video frames.

#### `addFilterStream(filter)`

Returns a `TransformStream` that applies the specified filter to faces in a video stream.

#### `colorPop(image)`

Applies a grayscale background, keeping faces in color.

#### `track(face, options)`

Draws an outline around the detected face.

#### `blur(face, blurRadius)`

Applies a Gaussian blur to the detected face.

#### `replace(face, image, keepLandmarks)`

Replaces a detected face with a provided image. If `keepLandmarks` is `true`, the original eyes and mouth are preserved.

---

### ShakeFaceEvent

Custom event class for ShakeFace events.

#### `constructor(type, eventData, options)`

- `type`: Event type.
- `eventData`: Additional data.
- `options`: Event options.

---

## Examples

Apply a color pop filter:

```javascript
shakeFace.colorPop();
```

Track a face:

```javascript
shakeFace.track(face, { stroke: 'green', lineWidth: 2 });
```

Blur a face:

```javascript
shakeFace.blur(face, 5);
```

Replace a face but keep the user's eyes and mouth:

```javascript
shakeFace.replace(face, replacementImage, true);
```

---

## Social Media

Connect with the author:

- [![TikTok](https://img.shields.io/badge/TikTok-%23000000.svg?style=for-the-badge&logo=TikTok&logoColor=white)](https://www.tiktok.com/@jyroneparker)
- [![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white)](https://www.instagram.com/mastashake08)
- [![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://www.youtube.com/c/jyroneparker)
- [![X (Twitter)](https://img.shields.io/badge/X-%231DA1F2.svg?style=for-the-badge&logo=Twitter&logoColor=white)](https://twitter.com/jyroneparker)
- [![Website](https://img.shields.io/badge/Website-%23000000.svg?style=for-the-badge&logo=About.me&logoColor=white)](https://jyroneparker.com)

---

## Support / Funding

If you find ShakeFace useful, please consider supporting the project:

- [GitHub Sponsors](https://github.com/sponsors/mastashake08)
- [Patreon](https://www.patreon.com/mastashake08)
- [Ko-fi](https://ko-fi.com/mastashake08)
- [Liberapay](https://liberapay.com/mastashake08)
- [Cash App](https://cash.app/$mastashake08)

Your support helps maintain and improve this project!

---

## License

This software is free to use for hobbyist programmers and developers, free of charge, provided that proper attribution is given to the original author.

Any commercial use of this software is strictly prohibited without a separate license contract. For commercial licensing, please contact the author.

Copyright (c) 2025 Jyrone "Mastashake" Parker <jyrone@jyroneparker.com>
