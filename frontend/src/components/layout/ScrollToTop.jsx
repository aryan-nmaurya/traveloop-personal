import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Temporarily disable smooth scrolling for instant reset
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    // Restore CSS behavior
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = '';
    }, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
