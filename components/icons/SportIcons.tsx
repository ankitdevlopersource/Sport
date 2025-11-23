import React from 'react';

// New, more detailed icons

export const CricketIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-2.29V15H9v-2h2v-2.71c0-1.5.86-2.29 2.29-2.29.43 0 .83.14 1.13.39l-1.42 1.42c-.1-.06-.23-.1-.39-.1-.34 0-.71.21-.71.8V13h2v2h-2v2.71c-1.1.25-2 .5-2 0z" />
        <path transform="rotate(45 18 6)" d="M17 4h2v4h-2z" />
        <path transform="rotate(45 18 6)" d="M16 5h4v2h-4z" />
    </svg>
);

export const FootballIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.88 4.07L15 8.28l2.3.34-1.74 1.57.48 2.31-2.04-1.2-2.04 1.2.48-2.31-1.74-1.57 2.3-.34zm-3.88 1.4L11 9.68l-2.3.34 1.74 1.57-.48 2.31 2.04-1.2 1.02.6-1.5-2.58zM8.5 16.5l2.04-1.2.48 2.31-1.74 1.57 2.3.34L13 22l-2.12-2.22-1.38-2.28z" />
    </svg>
);

export const BadmintonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M20.37 8.37L15.63 3.63a1.5 1.5 0 00-2.12 0L12 5.12l-1.51-1.51a1.5 1.5 0 00-2.12 0L3.63 8.37a1.5 1.5 0 000 2.12L8.88 15.7a1.5 1.5 0 002.12 0l1.51-1.51 1.51 1.51a1.5 1.5 0 002.12 0l5.25-5.21a1.5 1.5 0 000-2.12zM11 12.88L9.12 11l4.25-4.25L15.25 8.63 11 12.88z" />
        <path d="M18 19.5c0 .83-.67 1.5-1.5 1.5S15 20.33 15 19.5v-3h3v3z" />
    </svg>
);

export const AthleticsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 11.7V18h2v-6.2l2.2-2.2c.8-.8 2-.8 2.8 0l1.2 1.2c.4.4.4 1 0 1.4-.4.4-1 .4-1.4 0L12 10.8l-1.6 1.6c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l.8-.8z" />
    </svg>
);

export const KabaddiIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4 1.84-2.82 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm6 0c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
    </svg>
);

// Icons for the upload step in the original design, can be repurposed or removed
export const FitnessUploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M21 4H3C1.9 4 1 4.9 1 6v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM8.5 15l2.5-3.01L13.5 15h5l-3.5-4.51L12.5 13 10 9.98 8.5 12.5V15z" />
  </svg>
);

export const SportUploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);