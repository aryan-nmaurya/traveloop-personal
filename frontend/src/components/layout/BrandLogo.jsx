import { Link } from 'react-router-dom';
import logoImage from '../../assets/traveloop-logo.png';
import { cn } from '../../utils/cn';

const BrandLogo = ({ to = '/', className = '', imgClassName = '' }) => {
  return (
    <Link className={cn('inline-flex items-center', className)} to={to}>
      <img
        alt="Traveloop"
        className={cn('h-10 w-auto object-contain', imgClassName)}
        src={logoImage}
      />
    </Link>
  );
};

export default BrandLogo;

