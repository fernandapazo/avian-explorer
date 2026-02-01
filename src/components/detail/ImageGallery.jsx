
import { useState } from 'react';
import { X, Camera, Maximize2 } from 'lucide-react';
import '../../styles/ImageGallery.css';

export default function ImageGallery({ images, isOpen, onClose }) {
    const [selectedImage, setSelectedImage] = useState(null);

    if (!isOpen) return null;

    // If no images (or only empty/fallback processing led to 0 real images), show funny message
    const hasImages = images && images.length > 0;

    return (
        <div className="gallery-overlay" onClick={onClose}>
            <div className="gallery-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <h3 className="gallery-title">Species Gallery</h3>

                {hasImages ? (
                    <div className="gallery-grid">
                        {images.map((img, index) => (
                            <div key={index} className="gallery-item" onClick={() => setSelectedImage(img)}>
                                <img src={img} alt={`Gallery ${index + 1}`} loading="lazy" />
                                <div className="zoom-hint">
                                    <Maximize2 size={20} color="white" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="icon-circle large">
                            <Camera size={48} />
                        </div>
                        <h4>Camera Shy!</h4>
                        <p>This bird species is a bit elusive. We haven't found any paparazzi photos of them yet.</p>
                        <p className="subtext">Maybe they are in witness protection?</p>
                    </div>
                )}
            </div>

            {/* Lightbox Overlay */}
            {selectedImage && (
                <div className="lightbox-overlay" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                }}>
                    <button className="lightbox-close">
                        <X size={32} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Full size"
                        className="lightbox-img"
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
