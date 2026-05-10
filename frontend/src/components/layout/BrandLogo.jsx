import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

const BrandMark = ({ className = '' }) => {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 160 96"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="traveloop-brand-gradient" x1="18" x2="142" y1="76" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#173DBB" />
          <stop offset="1" stopColor="#18BDD8" />
        </linearGradient>
      </defs>
      <path
        d="M25 64C18 48 22 31 34 23C50 13 67 19 81 33L92 44L106 34C120 24 138 27 145 41C152 55 146 72 132 77C120 82 109 78 97 68L84 58L67 69C54 77 39 76 31 68"
        stroke="url(#traveloop-brand-gradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
      <path
        d="M54 60V40C54 36 57 33 61 33H69C73 33 76 36 76 40V60"
        stroke="url(#traveloop-brand-gradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
      <path
        d="M59 33V26C59 23 61 21 64 21H66C69 21 71 23 71 26V33"
        stroke="url(#traveloop-brand-gradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
      <path
        d="M63 60V46"
        stroke="url(#traveloop-brand-gradient)"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <path
        d="M128 12L134 6M128 12L135 20M128 12L120 11M128 12L129 21"
        stroke="url(#traveloop-brand-gradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.5"
      />
      <path
        d="M92 54L114 39"
        stroke="url(#traveloop-brand-gradient)"
        strokeDasharray="8 9"
        strokeLinecap="round"
        strokeWidth="3.5"
      />
    </svg>
  );
};

const WordMark = ({ className = '' }) => {
  return (
    <span className={cn('inline-flex items-center whitespace-nowrap text-[28px] font-medium tracking-[0.34em] text-[#142a69]', className)}>
      <span>TRAVEL</span>
      <svg className="mx-1.5 h-[24px] w-[40px] shrink-0" fill="none" viewBox="0 0 44 24" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="traveloop-word-gradient" x1="2" x2="42" y1="22" y2="2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#173DBB" />
            <stop offset="1" stopColor="#18BDD8" />
          </linearGradient>
        </defs>
        <path
          d="M3 12C6 4 11 4 17 12C23 20 28 20 31 12C34 4 39 4 41 12C39 20 34 20 28 12C22 4 17 4 14 12C11 20 6 20 3 12Z"
          stroke="url(#traveloop-word-gradient)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.4"
        />
      </svg>
      <span className="bg-[linear-gradient(90deg,#173DBB_0%,#18BDD8_100%)] bg-clip-text text-transparent">P</span>
    </span>
  );
};

const BrandLogo = ({ to = '/', className = '', markClassName = '', wordClassName = '' }) => {
  return (
    <Link className={cn('inline-flex items-center gap-3', className)} to={to}>
      <BrandMark className={cn('h-12 w-20 shrink-0', markClassName)} />
      <WordMark className={wordClassName} />
    </Link>
  );
};

export default BrandLogo;
