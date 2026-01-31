import '../styles/Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <p>&copy; {new Date().getFullYear()} Avian Explorer. Built for bird lovers.</p>
                <div className="footer-links">
                    <a href="https://aves.ninjas.cl/api/birds" target="_blank" rel="noopener noreferrer">API Source</a>
                </div>
            </div>
        </footer>
    );
}
