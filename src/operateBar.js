import React from 'react';
import './static/css/common.css';

const OperateBar = (props) => {
    
    let { uid, deleteFile } = props;

    return (
        <div className="chueasy-operatebar">
            <div className="uploaded-img-del" onClick={() => deleteFile(uid)}>
            </div>
        </div>
    );
}

export default OperateBar;