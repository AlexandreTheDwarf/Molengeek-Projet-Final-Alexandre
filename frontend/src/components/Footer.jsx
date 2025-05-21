import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faDiscord } from '@fortawesome/free-brands-svg-icons';

function Footer() {
    return (
        <footer className="bg-mana-black text-mana-gold py-8 shadow-magic font-magic">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h2 className="text-xl font-bold tracking-wider">ManaGathering</h2>
                    <p className="text-sm text-mana-white mt-1">
                        © {new Date().getFullYear()} Tous droits réservés.
                    </p>
                </div>

                <div className="flex gap-6 text-sm">
                    <a href="#" className="hover:text-mana-white transition duration-300">À propos</a>
                    <a href="#" className="hover:text-mana-white transition duration-300">Contact</a>
                    <a href="#" className="hover:text-mana-white transition duration-300">Mentions légales</a>
                </div>

                <div className="flex gap-6 text-2xl">
                    <a href="https://github.com/AlexandreTheDwarf" className="hover:text-mana-white transition duration-300">
                        <FontAwesomeIcon icon={faGithub} />
                    </a>
                    <a href="https://www.linkedin.com/in/alexandre-vandewiele-b6b5422ba/" className="hover:text-mana-white transition duration-300">
                        <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                    <a href="#" className="hover:text-mana-white transition duration-300">
                        <FontAwesomeIcon icon={faDiscord} />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
