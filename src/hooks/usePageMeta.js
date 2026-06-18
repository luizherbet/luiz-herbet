import { useEffect } from 'react';

const DEFAULT_TITLE = 'Luiz Pipa | Artista — Música, Poesia e Artes Visuais';
const DEFAULT_DESCRIPTION =
  'Luiz Pipa é artista brasileiro multidisciplinar — músico, poeta e pintor. Disco, livro Nas Entrelinhas e quadros no site oficial.';

function setMetaContent(selector, content) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    const isProperty = selector.includes('property=');
    const attribute = isProperty ? 'property' : 'name';
    const value = selector.match(/"([^"]+)"/)[1];
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export function usePageMeta({ title, description, canonical }) {
  useEffect(() => {
    const previousTitle = document.title;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const previousDescription = descriptionMeta?.getAttribute('content');
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    const previousCanonical = canonicalLink?.getAttribute('href');

    document.title = title;
    if (description) {
      setMetaContent('meta[name="description"]', description);
    }
    if (canonical && canonicalLink) {
      canonicalLink.setAttribute('href', canonical);
    }

    return () => {
      document.title = previousTitle;
      if (descriptionMeta && previousDescription) {
        descriptionMeta.setAttribute('content', previousDescription);
      }
      if (canonicalLink && previousCanonical) {
        canonicalLink.setAttribute('href', previousCanonical);
      }
    };
  }, [title, description, canonical]);
}

export const defaultPageMeta = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  canonical: 'https://www.luizpipa.com.br/',
};
