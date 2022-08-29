import * as React from 'react'
import styles from './ResouceAccordian.module.scss'

const AccordianItem = ({ item }) => {
    const [show, setShow] = React.useState(false)
    return (
        <div className={styles.itemContainer}>
            <div className={styles.headingContainer}>
                <h2 className={styles.plus} onClick={() => setShow(prev => !prev)}>
                    <div className={styles.inner}>{show ? '-' : '+'}</div>
                </h2>
                <div className={styles.option}>
                    <h3 className={styles.heading}>{item[0].Title}</h3>
                </div>
            </div>
            <div className={styles.subContainer}>
                {show && item.map(val => <a className={styles.subitems} href={val.RedirectionLink.Url}>{val.SubTitle}</a>)}
            </div>
        </div>
    )
}

export default AccordianItem