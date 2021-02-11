import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styles from './Home.module.scss';
import {makeStyles} from "@material-ui/styles";

import items from "../../shared/data";


const useStyles = makeStyles({
    root: {
        width: 400,
    },
});


let retrivedData = JSON.parse(localStorage.getItem('data')).items;
if(!retrivedData){
    console.log('no data found in localStorage! Saving data now!');
    localStorage.setItem('data', JSON.stringify(items));
    retrivedData = JSON.stringify(items).items;
}

const Home = () => {
    const [value, setValue] = useState(0);
    const classes = useStyles();
    return (
        <div className={styles.homeDiv}>
            <h2 className={styles.homeTitle}>
                Welcome to the REWARD Äpp!
            </h2>
            {retrivedData.length > 0 ?
                (retrivedData.map(item => (
                    <div>
                        <p>{item.id}</p>
                        <p>{item.title}</p>
                        <p>{item.isInCloud}</p>
                        <p>{item.isInCloud ? 'true': 'false'}</p>
                        <p>{item.type}</p>
                    </div>
                )))
            : null}
        </div>

    );
}


Home.propTypes = {};

Home.defaultProps = {};

export default Home;
