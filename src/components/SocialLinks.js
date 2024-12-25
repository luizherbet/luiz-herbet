import { FaFacebook, FaXing, FaInstagram, FaLinkedin } from 'react-icons/fa';

const SocialLinks = () => {
  return (
    <div className="flex space-x-4">
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-black hover:text-blue-800"
      >
        <FaFacebook className="h-6 w-6" />
      </a>
      <a
        href="https://x.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-black hover:text-gray-600"
      >
        <FaXing className="h-6 w-6" />
      </a>
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-black hover:text-pink-700"
      >
        <FaInstagram className="h-6 w-6" />
      </a>
      <a
        href="https://linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-black hover:text-blue-900"
      >
        <FaLinkedin className="h-6 w-6" />
      </a>
    </div>
  );
};

export default SocialLinks;
