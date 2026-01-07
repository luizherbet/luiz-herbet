import { FaFacebook, FaXing, FaInstagram, FaLinkedin } from "react-icons/fa";

const SocialLinks = () => {
  return (
    <div className="flex space-x-3 md:space-x-4 mr-2">
      <a
        href="https://www.linkedin.com/in/luiz-herbet-souza-040369285/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        aria-label="LinkedIn"
      >
        <FaLinkedin className="h-5 w-5 md:h-6 md:w-6" />
      </a>
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        aria-label="Instagram"
      >
        <FaInstagram className="h-5 w-5 md:h-6 md:w-6" />
      </a>
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        aria-label="Facebook"
      >
        <FaFacebook className="h-5 w-5 md:h-6 md:w-6" />
      </a>
    </div>
  );
};

export default SocialLinks;

const styles = {
  link: '"text-black hover:text-blue-900 hover:scale-110 hover:transition-all',
};
