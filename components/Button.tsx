import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', fullWidth = false, loading = false, className = '', ...props }, ref) => {
    const classes = [
      styles.button,
      styles[variant],
      size !== 'medium' && styles[size],
      fullWidth && styles.fullWidth,
      loading && styles.loading,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return <button ref={ref} className={classes} disabled={loading || props.disabled} {...props} />;
  }
);

Button.displayName = 'Button';

export default Button;
