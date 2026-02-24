import { memo } from 'react';
import PropTypes from 'prop-types';
import { getLogoUrl } from '../../constants';

/**
 * Logo Component - Reusable logo component for the entire project
 * 
 * @param {Object} props
 * @param {'default' | 'collapsed'} props.mode - Logo display mode
 * @param {'DEFAULT' | 'VARIANT1'} props.variant - Logo variant (auto-selected based on mode if not provided)
 * @param {string} props.className - Custom className to override default styles
 * @param {string} props.alt - Alt text for the logo
 * @param {Object} props.containerClassName - Container div className
 * 
 * @example
 * // Default expanded logo
 * <Logo />
 * 
 * @example
 * // Collapsed square logo
 * <Logo mode="collapsed" />
 * 
 * @example
 * // Custom variant and styles
 * <Logo variant="VARIANT1" className="w-20 h-20" />
 */
export const Logo = memo(({ 
    mode = 'default',
    variant,
    className,
    alt = 'Logo',
    containerClassName,
}) => {
    // Auto-select variant based on mode if not explicitly provided
    const logoVariant = variant || (mode === 'collapsed' ? 'VARIANT1' : 'DEFAULT');
    
    // Default responsive classes based on mode
    const defaultClasses = mode === 'collapsed'
        ? 'w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain'
        : 'h-10 md:h-11 lg:h-12 w-auto object-contain';
    
    // Default container classes
    const defaultContainerClasses = mode === 'collapsed'
        ? 'w-full py-2 md:py-2.5 lg:py-3 flex justify-center items-center flex-shrink-0'
        : 'w-full px-6 py-2 md:px-8 md:py-2.5 lg:px-10 lg:py-3 flex justify-start items-center flex-shrink-0';

    return (
        <div className={containerClassName || defaultContainerClasses}>
            <img
                src={getLogoUrl(logoVariant)}
                alt={alt}
                className={className || defaultClasses}
            />
        </div>
    );
});

Logo.propTypes = {
    mode: PropTypes.oneOf(['default', 'collapsed']),
    variant: PropTypes.oneOf(['DEFAULT', 'VARIANT1']),
    className: PropTypes.string,
    alt: PropTypes.string,
    containerClassName: PropTypes.string,
};

Logo.displayName = 'Logo';

export default Logo;
