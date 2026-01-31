import { Link } from 'react-router-dom';
import { Binoculars } from 'lucide-react';
import '../styles/Header.css';

export default function Header() {
    return (
        <header className="header">
            <div className="container header-container">
                <Link to="/" className="logo">
                    <Binoculars className="logo-icon" size={28} />
                    <span className="logo-text">Avian Explorer</span>
                </Link>
                <nav className="nav">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/discovery" className="nav-link">Discovery</Link>
                </nav>
            </div>
        </header>
    );
}
