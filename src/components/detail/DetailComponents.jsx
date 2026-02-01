
import { Play, Share2, Info, Feather, Map as MapIcon, Leaf, Ruler, MapPin, Camera } from 'lucide-react';
import '../../styles/BirdDetail.css';

export function DetailHero({ bird, onPlay, onGallery }) {
    const scrollToAudio = () => {
        if (onPlay) onPlay();
        // Small delay to allow expansion before scrolling
        setTimeout(() => {
            const audioSection = document.getElementById('audio-player');
            if (audioSection) {
                audioSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    return (
        <section className="detail-hero">
            <div className="container hero-grid">
                <div className="detail-visual">
                    <img src={bird.images.full} alt={bird.name.english} className="hero-img" />
                    <div className="img-overlay">
                        <button className="expand-btn" onClick={onGallery}>
                            <Camera size={18} />
                            View Gallery
                        </button>
                    </div>
                </div>

                <div className="detail-header">
                    <div className="header-badges">
                        <span className="badge-pill green">{bird.conservationStatus || 'Least Concern'}</span>
                        <span className="badge-pill outline">{bird.name.latin}</span>
                        <span className="badge-pill outline">
                            <MapPin size={12} style={{ marginRight: '4px', display: 'inline-block' }} />
                            {bird.location}
                        </span>
                    </div>

                    <h1 className="species-name">{bird.name.english}</h1>
                    <p className="species-desc">
                        A common sight in {bird.location}, known for its distinctive
                        appearance and behavior. {bird.funFact || "This species is a favorite among birdwatchers."}
                    </p>

                    <div className="action-row">
                        <button className="btn btn-primary big-btn" onClick={scrollToAudio}>
                            <span className="icon-circle"><Play size={20} fill="currentColor" /></span>
                            Listen to Song
                        </button>
                        <button className="btn btn-outline big-btn">
                            <Share2 size={20} /> Share
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function InfoGateway({ bird }) {
    return (
        <section className="gateway-section">
            <div className="container">
                <h3 className="section-label">Biological Data</h3>
                <div className="gateway-grid">

                    <div className="data-card">
                        <div className="card-icon"><Leaf size={24} color="#4ade80" /></div>
                        <div className="card-data">
                            <span className="label">Primary Diet</span>
                            <span className="value">{bird.diet}</span>
                        </div>
                    </div>

                    <div className="data-card">
                        <div className="card-icon"><Ruler size={24} color="#4ade80" /></div>
                        <div className="card-data">
                            <span className="label">Avg. Wingspan</span>
                            <span className="value">{bird.wingspan}</span>
                        </div>
                    </div>

                    <div className="data-card">
                        <div className="card-icon"><Feather size={24} color="#4ade80" /></div>
                        <div className="card-data">
                            <span className="label">Lifespan</span>
                            <span className="value">~5-8 Years</span>
                        </div>
                    </div>

                    <div className="data-card">
                        <div className="card-icon"><MapIcon size={24} color="#4ade80" /></div>
                        <div className="card-data">
                            <span className="label">Habitat</span>
                            <span className="value">Open Woodlands</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export function AudioPlayer({ audioUrl, visible }) {
    return (
        <div id="audio-player" className={`audio-player-container ${visible ? 'visible' : ''}`}>
            <div className="container">
                {audioUrl ? (
                    <div className="player-box">
                        <div className="player-info">
                            <h4>Live Recording</h4>
                            <p className="subtext">From Xeno-canto Database</p>
                        </div>
                        <audio controls className="native-audio" src={audioUrl} key={audioUrl}>
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                ) : (
                    <div className="player-empty-state" style={{ textAlign: 'center', color: '#cbd5e1' }}>
                        <p>No audio recording available for this species.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
