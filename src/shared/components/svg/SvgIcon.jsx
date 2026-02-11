import PropTypes from 'prop-types';

function SvgIcon({
    src,
    alt = '',
    size = 24,
    width,
    height,
    className = '',
    ...props
}) {
    const w = width || size;
    const h = height || size;

    return (
        <img
            src={src}
            alt={alt}
            width={w}
            height={h}
            className={className}
            {...props}
        />
    );
}

SvgIcon.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    size: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string,
};

export default SvgIcon;
