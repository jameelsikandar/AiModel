import { useState } from 'react';
import { BeatLoader } from 'react-spinners';

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }
  
    setIsLoading(true);
    setError('');
    setPrediction(null);
  
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      const response = await fetch('http://localhost:8000/predict/', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }
  
      const result = await response.json();
      setPrediction(result);
    } catch (err) {
      setError('An error occurred while processing the image.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError('');
  };

  return (
    <div className="min-h-screen py-12 px-4 relative">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url('/AA.jpg')`,
            filter: 'brightness(0.4) blur(2px)'
          }}
        ></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
          Cat vs Dog Classifier
        </h1>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 transition-all duration-300 hover:shadow-xl">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6">
            {previewUrl ? (
              <div className="relative group">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-64 mx-auto rounded-lg mb-4 transform group-hover:scale-105 transition-transform"
                />
                <button
                  onClick={handleReset}
                  className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg 
                      className="w-6 h-6 text-purple-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <span className="text-purple-600 font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">JPEG, PNG up to 5MB</p>
                  </div>
                </div>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading || !selectedFile}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <BeatLoader color="#ffffff" size={8} />
            ) : (
              'Classify Image'
            )}
          </button>
        </div>

        {prediction && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-4">Result</h2>
            <div className={`p-4 rounded-lg ${
              prediction.class === 'Cat' ? 'bg-purple-100' : 'bg-blue-100'
            }`}>
              <div className="flex items-center justify-center space-x-4">
                <span className="text-4xl">
                  {prediction.class === 'Cat' ? '🐱' : '🐶'}
                </span>
                <div>
                  <p className="text-lg font-semibold">
                    This is a {prediction.class}!
                  </p>
                  <p className="text-gray-600">
                    Confidence: {prediction.confidence}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}