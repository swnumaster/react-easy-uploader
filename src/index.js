import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Instruction from './instruction';
import ProgressBar from './progresssBar';
import OperateBar from './operateBar';
import compressImage from './compressImage';
import { genUniqueId, deepcopyArray } from './utils';
import defaultSettings from './settings';
import './static/css/common.css';
import './static/css/style1.css';
import './static/css/style2.css';

// The reason why I didn't choose to use Function Component is that 
// it is necessary to initialize the state with props.fileList, but 
// in Function Component, useState() will be called repeatedly.
// I am searching a method solving the issue when using Function Component.

// Realize ReactEasyUploader by a class component
class ReactEasyUploader extends React.PureComponent {

    constructor(props) {
        super(props);

        // init state
        let fileList = props.fileList ? props.fileList : [];
        for (let i in fileList) {
            fileList[i].uid = genUniqueId();
        }
        this.state = {
            fileList: fileList
        };

        // init params
        this.uploadApi = props.uploadApi;
        this.inputName = props.inputName;
        this.parseResponse = props.parseResponse;
        this.onFileListChange = props.onFileListChange;
        this.onException = props.onException; // optional
        this.headers = props.headers; // optional
        this.quality = props.quality ? props.quality : defaultSettings.quality; // optional
        this.maxSize = props.maxSize ? props.maxSize : defaultSettings.maxSize; // optional
        this.maxCount = props.maxCount ? props.maxCount : defaultSettings.maxCount; // optional
        this.buttonName = props.buttonName ? props.buttonName : defaultSettings.buttonName; // optional
        this.frameStyle = (props.frameStyle && props.frameStyle === "circle") ? "chueasy-uploader-wrapper-2" : "chueasy-uploader-wrapper-1"; // optional
    }

    // Notice: "func = () => {}" this definition is just supported by ES6.
    // Therefore, here I define functions using the "func() {}" definition.

    // add a file
    addFile(uid, url) {
        this.setState((preState) => {
            let newFileList = deepcopyArray(preState.fileList);   // deepcopy an array
            newFileList.push({
                uid,
                url,
                filename: '',
                loadedSize: 0,
                totalSize: 0
            });
            return {fileList: newFileList};
        });
    }

    // delete a file
    deleteFile(uid) {
        this.setState((preState) => {
            // Using "let newFileList = preState.fileList;" doesn't work,
            // since deepcopying is necessary.
            let newFileList = deepcopyArray(preState.fileList);   // deepcopy an array
            newFileList.splice(newFileList.findIndex(e => e.uid === uid), 1);
            return {fileList: newFileList};
        });
    }

    // set uploading progress
    setUploadProgress(uid, loadedSize, totalSize) {
        this.setState((preState) => {
            let newFileList = deepcopyArray(preState.fileList);   // deepcopy an array
            for (let i in newFileList) {
                if (newFileList[i].uid === uid) {
                    newFileList[i].loadedSize = loadedSize;
                    newFileList[i].totalSize = totalSize;
                }
            }
            return {fileList: newFileList};
        });
    }

    // set uploaded filename
    setFileName(uid, filename) {
        this.setState((preState) => {
            let newFileList = deepcopyArray(preState.fileList);   // deepcopy an array
            for (let i in newFileList) {
                if (newFileList[i].uid === uid) {
                    newFileList[i].filename = filename;
                }
            }
            return {fileList: newFileList};
        });
    }

    // Trigger the click event of file upload input
    handleClick() {
        this.uploadInput.click();
    }

    // Call the function while choosed a file
    handleChange() {

        const addFile = (uid, result) => {
            this.addFile(uid, result);
        }
        
        if (this.uploadInput.files.length === 0) return;

        // step1: get the choosed file from the input element.
        let originalFile = this.uploadInput.files[0];  // type is File {name: "test.jpg", lastModified: 1622528580998, ...}
        this.uploadInput.value = '';

        // step2: add the file to the fileList in state
        let uid = genUniqueId();
        let reader = new FileReader();
        reader.readAsDataURL(originalFile);
        reader.onload = function() {
            // Since in this function, here cannot call addFile of the ReactEasyUploader class,
            // I define the function addFile inside the handleChange function.
            // The 'this' is 'reader', so using 'reader.result' is OK as well.
            addFile(uid, this.result);
        }; 
        
        // step3: handle something before upload
        let beforeUploadPromise = this.handleBeforeUpload(originalFile);
        beforeUploadPromise.then((handledFile) => {
            // step4: handle upload
            this.handleUpload(uid, handledFile);
        })
    }

    // Async function returns a Promise object
    async handleBeforeUpload(file) {
        let handledFile = await compressImage(file, this.quality, this.maxSize);
        return handledFile;
    }

    // handle upload
    handleUpload(uid, handledFile) {
        // check variables
        if (!this.uploadApi || !this.inputName)
            return;

        // prepare post data
        let params = new FormData();
        params.append(this.inputName, handledFile);
        let requestHeaders = {"Content-Type":"multipart/form-data"};

        // add additonal headers settings
        if (this.headers) Object.assign(requestHeaders, this.headers);

        // define the function for handling onUploadProgress
        const handleUploadProgress = (progress) => {
            this.setUploadProgress(uid, progress.loaded, progress.total);
        }

        // submit request
        axios.post(this.uploadApi, params, {headers: requestHeaders, onUploadProgress: handleUploadProgress})
            .then(resp => {   // success
                let filename = this.parseResponse(resp.data);
                if (filename)
                    this.setFileName(uid, filename);
                else
                    this.deleteFile(uid);
            })
            .catch((e) => {
                if (this.onException) this.onException(e);
                this.deleteFile(uid);
            });
    }

    handleMouseEnter(e) {
        var event = e || window.event;
        let eList = event.currentTarget.getElementsByClassName('chueasy-operatebar');   // cannot use event.target
        if (eList.length > 0) {
            eList[0].className = "chueasy-operatebar chueasy-visible";
        }
    }

    handleMouseLeave(e) {
        var event = e || window.event;
        let eList = event.currentTarget.getElementsByClassName('chueasy-operatebar');
        if (eList.length > 0) {
            eList[0].className = "chueasy-operatebar chueasy-hidden";
        }
    }

    render() {
        if (!this.inputName || !this.parseResponse || !this.onFileListChange) {
            return <Instruction />
        }

        return (
            <ul className={this.frameStyle}>
                {
                    this.state.fileList.map( (file, index) => {
                        return (
                            <li key={index} onMouseEnter={(e) => this.handleMouseEnter(e)} onMouseLeave={(e) => this.handleMouseLeave(e)}>
                                <div className="chueasy-img-wrapper">
                                    <img src={file.url} />
                                    <ProgressBar currentValue={file.loadedSize} maxValue={file.totalSize}/>
                                    <OperateBar deleteFile={() => this.deleteFile(file.uid)} uid={file.uid}/>
                                </div>
                            </li>
                        );
                    })
                }
                {   
                    this.state.fileList.length < this.maxCount &&
                    <li className="chueasy-btn-upload" onClick={() => this.handleClick()}>
                        {this.buttonName}
                        <input 
                            type="file" 
                            ref={(e) => {this.uploadInput = e}} 
                            style={{display: "none"}} 
                            accept="image/png, image/gif, image/jpeg" 
                            onChange={()=> this.handleChange()}
                        />
                    </li>
                }
            </ul>
        );
    }

    componentDidUpdate() {
        this.onFileListChange(this.state.fileList);
    }
}

// Realize ReactEasyUploader by a function component
const ReactEasyUploader_FC = (props) => {
    
    const { headers, uploadApi, inputName, parseResponse, onFileListChange, onException } = props;
    let { quality, maxSize, maxCount, buttonName, frameStyle } = props;
    if (!inputName || !parseResponse || !onFileListChange) {
        return <Instruction />;
    }
    if (!quality) quality = defaultSettings.quality;
    if (!maxSize) maxSize = defaultSettings.maxSize;
    if (!maxCount) maxCount = defaultSettings.maxCount;
    if (!buttonName) buttonName = defaultSettings.buttonName;
    frameStyle = (frameStyle && frameStyle === "circle") ? "chueasy-uploader-wrapper-2" : "chueasy-uploader-wrapper-1";

    // ========================================================================================================
    // Here, cannot pass a changable initialState into useState, otherwise, status will be initialized again.
    // We can pass a function into useState and in the function we can calculate dafault values.

    // let fileList = props.fileList.slice(0);
    // for (let i in fileList) {
    //     fileList[i].uid = genUniqueId();
    // }
    // const [ status, setStatus ] = useState({
    //     fileList: fileList,
    // });

    const [ status, setStatus ] = useState(() => {  // The function passed to useState is just called once.
        let fileList = props.fileList ? props.fileList : [];
        for (let i in fileList) {
            fileList[i].uid = genUniqueId();
        }
        return {fileList: fileList};
    });
    // ========================================================================================================
    
    const uploadInputRef = useRef(null);

    useEffect(() => {
        onFileListChange(status.fileList);
    }, [status.fileList]);

    // add a file
    const addFile = (uid, url) => {
        setStatus((preState) => {
            let newFileList = deepcopyArray(preState.fileList);   // deepcopy an array
            newFileList.push({
                uid,
                url,
                filename: '',
                loadedSize: 0,
                totalSize: 0
            });
            return {fileList: newFileList};
        });
    }

    // delete a file
    const deleteFile = (uid) => {
        console.log(uid);
        setStatus((preState) => {
            // Using "let newFileList = preState.fileList;" doesn't work,
            // since deepcopying is necessary.
            let newFileList = deepcopyArray(preState.fileList);   // deepcopy an array
            newFileList.splice(newFileList.findIndex(e => e.uid === uid), 1);
            return {fileList: newFileList};
        });
    }

    // set uploading progress
    const setUploadProgress = (uid, loadedSize, totalSize) => {
        setStatus((preState) => {
            let newFileList = deepcopyArray(preState.fileList);   // deepcopy an array
            for (let i in newFileList) {
                if (newFileList[i].uid === uid) {
                    newFileList[i].loadedSize = loadedSize;
                    newFileList[i].totalSize = totalSize;
                }
            }
            return {fileList: newFileList};
        });
    }

    // set uploaded filename
    const setFileName = (uid, filename) => {
        setStatus((preState) => {
            let newFileList = deepcopyArray(preState.fileList);   // deepcopy an array
            for (let i in newFileList) {
                if (newFileList[i].uid === uid) {
                    newFileList[i].filename = filename;
                }
            }
            return {fileList: newFileList};
        });
    }

    // Trigger the click event of file upload input
    const handleClick = () => {
        uploadInputRef.current.click();
    }

    // Call the function while choosed a file
    const handleChange = () => {
        
        if (uploadInputRef.current.files.length === 0) return;

        // step1: get the choosed file from the input element.
        let originalFile = uploadInputRef.current.files[0];  // type is File {name: "test.jpg", lastModified: 1622528580998, ...}
        uploadInputRef.current.value = '';

        // step2: add the file to the fileList in status
        let uid = genUniqueId();
        let reader = new FileReader();
        reader.readAsDataURL(originalFile);
        reader.onload = function() {
            addFile(uid, this.result);  // or use reader.result
        }; 
        
        // step3: handle something before upload
        let beforeUploadPromise = handleBeforeUpload(originalFile);
        beforeUploadPromise.then((handledFile) => {
            // step4: handle upload
            handleUpload(uid, handledFile);
        })
    }

    // Async function returns a Promise object
    const handleBeforeUpload = async (file) => {
        let handledFile = await compressImage(file, quality, maxSize);
        return handledFile;
    }

    // handle upload
    const handleUpload = (uid, handledFile) => {
        // check variables
        if (!uploadApi || !inputName)
            return;
        // prepare post data
        let params = new FormData();
        params.append(inputName, handledFile);
        let requestHeaders = {"Content-Type":"multipart/form-data"};

        // add additonal headers settings
        if (headers) Object.assign(requestHeaders, headers);

        // define the function for handling onUploadProgress
        const handleUploadProgress = (progress) => {
            setUploadProgress(uid, progress.loaded, progress.total);
        }

        // submit request
        axios.post(uploadApi, params, {headers: requestHeaders, onUploadProgress: handleUploadProgress})
            .then(resp => {   // success
                let filename = parseResponse(resp.data);
                if (filename)
                    setFileName(uid, filename);
                else 
                    deleteFile(uid);
            })
            .catch((e) => {
                if (onException) onException(e);
                deleteFile(uid);
            });
    }

    const handleMouseEnter = (e) => {
        var event = e || window.event;
        let eList = event.currentTarget.getElementsByClassName('chueasy-operatebar');   // cannot use event.target
        if (eList.length > 0) {
            eList[0].className = "chueasy-operatebar chueasy-visible";
        }
    }

    const handleMouseLeave = (e) => {
        var event = e || window.event;
        let eList = event.currentTarget.getElementsByClassName('chueasy-operatebar');
        if (eList.length > 0) {
            eList[0].className = "chueasy-operatebar chueasy-hidden";
        }
    }

    // handlePreview = async (file) => {
    //     if (!file.url && !file.preview) {
    //       file.preview = await getImageBase64(file.originFileObj);
    //     }
    //     this.setState({
    //       previewImage: file.url || file.preview,
    //       previewVisible: true,
    //       previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    //     });
    // };

    return (
        <ul className={frameStyle}>
            {
                status.fileList.map( (file, index) => {
                    return (
                        <li key={index} 
                            onMouseEnter={(e) => handleMouseEnter(e)}
                            onMouseLeave={(e) => handleMouseLeave(e)}
                            onTouchStart={(e) => handleMouseEnter(e)}   // important to fit for mobile devices
                        >
                            <div className="chueasy-img-wrapper">
                                <img src={file.url} />
                                <ProgressBar currentValue={file.loadedSize} maxValue={file.totalSize}/>
                                <OperateBar deleteFile={() => deleteFile(file.uid)} uid={file.uid}/>
                            </div>
                        </li>
                    );
                })
            }
            {
                status.fileList.length < maxCount &&
                <li className="chueasy-btn-upload" onClick={() => handleClick()}>
                    {buttonName}
                </li>
            }
            <input style={{display: "none"}} ref={uploadInputRef} type="file" accept="image/png, image/gif, image/jpeg" onChange={()=> handleChange()}/>
        </ul>
    );
}

export default ReactEasyUploader_FC;

