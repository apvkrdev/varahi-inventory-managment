import React from 'react';
import styles from './Card.module.scss';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
  elevated?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', bordered = false, elevated = false }) => {
  const classes = [
    styles.card,
    bordered && styles.bordered,
    elevated && styles.elevated,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
};

export default Card;
