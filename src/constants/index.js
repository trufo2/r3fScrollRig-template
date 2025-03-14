export const navLinks = [
    {
        id: 1,
        name: 'Sites',
        href: '/sites',
    },
    {
        id: 2,
        name: 'Animations',
        href: '/animations',
    },
    {
        id: 3,
        name: 'Vidéos',
        href: '/videos',
    },
    {
        id: 4,
        name: 'Art',
        href: '/art',
    },
];
export const calculateSizes = (isSmall, isMobile, isTablet) => {
    return {
        deskScale: isSmall ? 0.05 : isMobile ? 0.06 : 0.065,
        deskPosition: isMobile ? [0, 0, 0] : [0, 0, 0],
    };
};