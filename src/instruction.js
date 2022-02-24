import React from 'react';
import './static/css/common.css';
import defaultSettings from './settings';

const Instruction = () => {

    return (
        <div className="chueasy-instruction-wrapper">
            <h1>Component props: </h1>
            <h2>Required</h2>
            <p>[uploadApi]: a API url for handling uploaded file</p>
            <p>[inputName]: a POST name for receiving uploaded file</p>
            <p>[parseResponse]: a callback function for parsing responding data from API and returning a parsed filename or false</p>
            <p>[onFileListChange]: a callback function for getting the latest fileList when fileList changed</p>
            <h2>Optional</h2>
            <p>[onException]: a callback function for getting exception</p>
            <p>[quality]: a quality rate (range from 0 to 1.0) for compressing uploaded images, default: {defaultSettings.quality}</p>
            <p>[maxSize]: an allowed pixel size (such as 1024) for compressing uploaded images, default: {defaultSettings.maxSize}</p>
            <p>[maxCount]: an allowed count of uploaded images: default: {defaultSettings.maxCount}</p>
            <p>[buttonName]: a name for the upload button, default: {defaultSettings.buttonName}</p>
            <p>[frameStyle]: "square" or "circle", default: {defaultSettings.frameStyle}</p>
        </div>
    );
}

export default Instruction;