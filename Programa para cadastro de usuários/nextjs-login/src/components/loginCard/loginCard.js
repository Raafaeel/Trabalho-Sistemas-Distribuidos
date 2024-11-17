import styles from './LoginCard.module.css';

export default function LoginCard({title, children}) {
    return (
        <div className={styles.Card}>
            <h4 className={styles.title}>{title}</h4>
            {children}
        </div>
    );
}

