import React from 'react';
import styles from './style.module.scss';

export type DropdownItem = {
  label: React.ReactNode;
  onClick?: () => void;
}

interface DropdownProps {
  button?: React.ReactNode;
  items: DropdownItem[];
}

const Dropdown: React.FC<DropdownProps> = ({ button = '菜单', items }) => {
  return (
    <div className={styles.container} aria-haspopup="true">
      <button className={styles.button} aria-expanded={false}>
        {button}
      </button>
      <div className={styles.menu} role="menu">
        {items.map((item, i) => (
          <button
            key={i}
            className={styles.item}
            role="menuitem"
            onClick={item.onClick}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
