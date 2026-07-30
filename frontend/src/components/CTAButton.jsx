export default function CTAButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  type = 'button',
  disabled = false,
  icon,
  style = {},
  ...props
}) {
  const sizes = {
    sm: { padding: '7px 16px', fontSize: '0.85rem' },
    md: { padding: '10px 22px', fontSize: '0.9375rem' },
    lg: { padding: '13px 28px', fontSize: '1rem' },
  };

  const className = variant === 'primary' ? 'btn-primary' : variant === 'secondary' ? 'btn-secondary' : 'btn-ghost';

  const Tag = href ? 'a' : 'button';
  const extraProps = href ? { href } : { type, onClick, disabled };

  return (
    <Tag
      className={className}
      style={{ ...sizes[size], opacity: disabled ? 0.6 : 1, cursor: disabled ? 'not-allowed' : 'pointer', ...style }}
      {...extraProps}
      {...props}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </Tag>
  );
}
