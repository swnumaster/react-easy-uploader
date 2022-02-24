import React from 'react';
import './static/css/common.css';

const ProgressBar = (props) => {
    
    let { percent, currentValue, maxValue } = props;

    if (currentValue && maxValue) {
        currentValue = parseInt(currentValue);
        maxValue = parseInt(maxValue);
        if (maxValue > 0) percent = parseInt((currentValue / maxValue) * 100);
    }

    if (percent) {
        percent = parseInt(percent);
        if (percent < 0) percent = 0;
        else if (percent > 100) percent = 100;
    }

    if (!percent || percent == 100) {
        return <React.Fragment></React.Fragment>
    }

    percent = percent + "%";

    return (
        <div className="chueasy-progressbar">
            <div>
                <div style={{width: percent}}></div>
            </div>
        </div>
    );
}

export default ProgressBar;

