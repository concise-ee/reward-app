import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styles from './Home.module.scss';
import {BottomNavigation, BottomNavigationAction} from "@material-ui/core";
import LocationOnIcon from '@material-ui/icons/LocationOn';
import {makeStyles} from "@material-ui/styles";
import {CloudQueue} from "@material-ui/icons";
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';


const useStyles = makeStyles({
    root: {
        width: 400,
    },
});


const Home = () => {
    const [value, setValue] = useState(0);
    const classes = useStyles();
    return (
        <div className={styles.homeDiv}>
            <h2 className={styles.homeTitle}>
                Welcome to the REWARD Äpp!
            </h2>
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
                className={classes.root}
            >
                <BottomNavigationAction label="Cloud" icon={<CloudQueue />} />
                <BottomNavigationAction label="MainView" icon={<WbIncandescentIcon />} />
                <BottomNavigationAction label="HowToNameThis?" icon={<LocationOnIcon />} />
            </BottomNavigation>
        </div>
    );
}


Home.propTypes = {};

Home.defaultProps = {};

export default Home;
