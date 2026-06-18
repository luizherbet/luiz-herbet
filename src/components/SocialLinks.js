import { FaInstagram, FaSpotify } from 'react-icons/fa';

const SocialLinks = () => {
  return (
    <div className="flex space-x-4">
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-stone-600 hover:text-stone-900 hover:scale-110 transition-all"
        aria-label="Instagram"
      >
        <FaInstagram className="h-5 w-5" />
      </a>
      <a
        href="https://open.spotify.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-stone-600 hover:text-stone-900 hover:scale-110 transition-all"
        aria-label="Spotify"
      >
        <FaSpotify className="h-5 w-5" />
      </a>
    </div>
  );
};

export default SocialLinks;
