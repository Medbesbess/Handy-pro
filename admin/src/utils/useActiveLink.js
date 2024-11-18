// useActiveLink.js
import { useState, useEffect } from 'react';

const useActiveLink = (defaultLink) => {
    const [activeLink, setActiveLink] = useState("/dashboard");

    const handleLinkClick = (target) => {
        setActiveLink(target);
    };

    useEffect(() => {
        const defaultLinkElement = document.querySelector(defaultLink);

        if (defaultLinkElement) {
            setActiveLink(defaultLinkElement.getAttribute('href'));
        }
    }, [defaultLink]);

    return {
        activeLink,
        handleLinkClick,
    };
};

export default useActiveLink;
