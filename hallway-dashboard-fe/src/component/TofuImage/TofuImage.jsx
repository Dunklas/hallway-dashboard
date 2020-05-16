import React from 'react';
import styles from './TofuImage.module.css';
import image from './tofulol.png';

const TofuImage = () => (
    <div className={styles.main}>
        <div className={styles.imageContainer}>
            <img src={image} alt="The great great grandmother of a tofu" />
        </div>
    </div>
);

export default TofuImage;