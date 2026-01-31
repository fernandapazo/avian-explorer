import { Link } from 'react-router-dom';
import '../styles/BirdCard.css';

export default function BirdCard({ bird }) {
    return (
        <Link to={`/bird/${bird.uid}`} className="bird-card">
            <div className="bird-card-image-wrapper">
                <img
                    src={bird.images.main}
                    alt={bird.name.english}
                    className="bird-card-image"
                    loading="lazy"
                />
            </div>
            <div className="bird-card-content">
                <span className="bird-card-latin">{bird.name.latin}</span>
                <h3 className="bird-card-title">{bird.name.english}</h3>
                <p className="bird-card-subtitle">{bird.name.spanish}</p>
            </div>
        </Link>
    );
}
