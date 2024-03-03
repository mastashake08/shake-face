// Noise Suppression Net 2 (NSNet2) Baseline Model for Deep Noise Suppression Challenge (DNS) 2021.
export class Blur {
    constructor() {
      this.graph = null;
      this.context = null;
      this.builder = null;
      this.createBuilder();
      this.
    }
    
    async createBuilder() {
      this.context = await navigator.ml.createContext();
      this.builder = new MLGraphBuilder(context);
    }
    async build(frame, face) {
      // Create constants by loading pre-trained data from .npy files.
      const weight = 2
      // Build up the network.
      const inputFrame = this.builder.input('frame', {dataType: 'float32', dimensions: [frame.codedHeight, frame.codedWidth, 4]});
      const inputKernel = this.builder.input('kernel', {dataType: 'float32', dimensions: [3,3]});
      const output = this.builder.conv2d(this.builder.add(this.builder.matmul(relu167, weight217), biasFcOut4));
      this.graph = await this.builder.build({'output': output, 'gru94': gru94, 'gru157': gru157});
    }
  
    async compute(inputBuffer, initialState92Buffer, initialState155Buffer, outputBuffer, gru94Buffer, gru157Buffer) {
      const inputs = {
        'input': inputBuffer,
        'initialState92': initialState92Buffer,
        'initialState155': initialState155Buffer,
      };
      const outputs = {
        'output': outputBuffer,
        'gru94': gru94Buffer,
        'gru157': gru157Buffer
      };
      await this.context.compute(this.graph, inputs, outputs);
    }

    makeGaussKernel(sigma){
        const GAUSSKERN = 6.0;
        var dim = parseInt(Math.max(3.0, GAUSSKERN * sigma));
        var sqrtSigmaPi2 = Math.sqrt(Math.PI*2.0)*sigma;
        var s2 = 2.0 * sigma * sigma;
        var sum = 0.0;
        
        var kernel = new Float32Array(dim - !(dim & 1)); // Make it odd number
        const half = parseInt(kernel.length / 2);
        for (var j = 0, i = -half; j < kernel.length; i++, j++) 
        {
          kernel[j] = Math.exp(-(i*i)/(s2)) / sqrtSigmaPi2;
          sum += kernel[j];
        }
        // Normalize the gaussian kernel to prevent image darkening/brightening
        for (var i = 0; i < dim; i++) {
          kernel[i] /= sum;
        }
        return kernel;
      }

    /**
* Internal helper method
* @param {VideoFrame} frame - the video frame
* @param kernel - the Gaussian blur kernel
* @param ch - the color channel to apply the blur on
* @param gray - flag to show RGB or Grayscale image
*/
gauss_internal(frame, face, kernel, ch, gray){
    
    var data = new Uint8Array(frame.allocationSize());
    var w = face.boundingBox.width;
    var h = face.boundingBox.height;
    var fw = face.boundingBox.x;
    var fh = face.boundingBox.y;
    var buff = new Uint8Array(frame.allocationSize()); 
    var mk = Math.floor(kernel.length / 2);
    var kl = kernel.length;
    
    // First step process columns
    for (var j = 0, fw; j < h; j++, fw += w) 
    {
      for (var i = 0; i < w; i++)
      {
        var sum = 0;
        for (var k = 0; k < kl; k++)
        {
          var col = i + (k - mk);
          col = (col < 0) ? 0 : ((col >= w) ? w - 1 : col);
          sum += data[(fw + col)*4 + ch]*kernel[k];
        }
        buff[fw + i] = sum;
      }
    }
    
    // Second step process rows
    for (var j = 0, offset = 0; j < h; j++, offset += w) 
    {
      for (var i = 0; i < w; i++)
      {
        var sum = 0;
        for (k = 0; k < kl; k++)
        {
          var row = j + (k - mk);
          row = (row < 0) ? 0 : ((row >= h) ? h - 1 : row);
          sum += buff[(row*w + i)]*kernel[k];
        }
        var off = (j*w + i)*4;
        (!gray) ? data[off + ch] = sum : 
                  data[off] = data[off + 1] = data[off + 2] = sum;
      }
    }
  }
  getInputTensor(frame, face) {
    const inputDimensions = [1, 4, face.boundingBox.height, face.boundingBox.width];
    const tensor = new Uint8Array(4).fill(inputDimensions);
  
   
  
    let [channels, height, width] = inputDimensions.slice(1);
   
    const imageChannels = 4; // RGBA
   
    let pixels = new Uint8Array(frame.allocationSize());
    frame.copyTo(pixels);
  

  
    for (let c = 0; c < channels; ++c) {
      for (let h = face.boundingBox.y; h < height; ++h) {
        for (let w = face.boundingBox.x; w < width; ++w) {
          let value;
            value = pixels[h * width * imageChannels + w * imageChannels + c];
          
            tensor[h * width * channels + w * channels + c] =
                (value - mean[c]) / std[c];
          
        }
      }
    }
    return tensor;
  }
  
  }
