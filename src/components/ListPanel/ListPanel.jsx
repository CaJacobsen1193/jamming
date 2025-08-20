import React from 'react';
import styles from './ListPanel.module.css';

export default function ListPanel({
  title,
  editable = false,
  onTitleChange,
  action = null,
  children
}) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {editable ? (
          <input
            type="text"
            value={title}
            onChange={onTitleChange}
            className={styles.titleInput}
          />
        ) : (
          <h2 className={styles.title}>{title}</h2>
        )}
        <div className={styles.action}>{action}</div>
      </div>

      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
