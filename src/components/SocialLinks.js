import { FaFacebook, FaXing, FaInstagram, FaLinkedin } from "react-icons/fa";

const SocialLinks = () => {
  return (
    <div className="hidden md:flex space-x-4 mr-3">
      <a
        href="https://www.linkedin.com/in/luiz-herbet-souza-040369285/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        <FaLinkedin className="h-6 w-6" />
      </a>
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        <FaInstagram className="h-6 w-6" />
      </a>
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        <FaFacebook className="h-6 w-6" />
      </a>
    </div>
  );
};

export default SocialLinks;

const styles = {
  link: '"text-black hover:text-blue-900 hover:scale-110 hover:transition-all',
};
