import { FaAmazon, FaInstagram, FaSpotify, FaYoutube } from 'react-icons/fa';
import { album } from '../data/content';
import { book } from '../data/book';

const SocialLinks = () => {
  return (
    <div className="flex space-x-4">
      <a
        href="https://www.instagram.com/pipaluiz/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-stone-600 hover:text-stone-900 hover:scale-110 transition-all"
        aria-label="Instagram @pipaluiz"
      >
        <FaInstagram className="h-5 w-5" />
      </a>
      <a
        href={album.spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-stone-600 hover:text-stone-900 hover:scale-110 transition-all"
        aria-label="Spotify — Luiz Pipa"
      >
        <FaSpotify className="h-5 w-5" />
      </a>
      <a
        href="https://www.youtube.com/@LuizHPipa"
        target="_blank"
        rel="noopener noreferrer"
        className="text-stone-600 hover:text-stone-900 hover:scale-110 transition-all"
        aria-label="YouTube"
      >
        <FaYoutube className="h-5 w-5" />
      </a>
      <a
        href={book.purchaseLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-stone-600 hover:text-stone-900 hover:scale-110 transition-all"
        aria-label="Livro na Amazon"
      >
        <FaAmazon className="h-5 w-5" />
      </a>
    </div>
  );
};

export default SocialLinks;
