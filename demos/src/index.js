import React from 'react';
import { render } from 'react-dom';
import ReactEasyUploader from '../../src';
import Instruction from '../../src/instruction';

// 仅做演示作用的配置数据
var imgUrl1 = require('../../src/static/images/p1.jpg');    // 模块化方式引用图片路径，这样引用的图片才可以打包进dist文件夹
var imgUrl2 = require('../../src/static/images/p2.jpg');

let fileList = [
    {url: imgUrl1, filename: "p1.jpg"},
    {url: imgUrl2, filename: "p2.jpg"},
];

let headers = {token: "NDQ4MDI4MzI4NTkzODc2OTkyMXwxNjIyNzA5MTg2LjcxNzUzMjk6YWRmNTRjNmUwOTU4YmM5MzQ1YTQyYjBkNDczMjBjNGNmNjVhMzkyZg=="};

let uploadApi = "";
//

function parseResponse(respData) {
    console.log(respData);
    if (respData.code === 0) {
        return respData.content.filename;
    }
    return false;
}

function onFileListChange(fileList) {
    console.log(fileList);
}

function onException(e) {
    console.log(e);
}

var packageJson = require('../../package.json');

const App = () => (
    <React.Fragment>
        <div className="chueasy-header-wrapper">
            <h2>react-easy-uploader (V{packageJson.version})</h2>
            <p>Author: {packageJson.author}</p>
            <p>Email: {packageJson.email}</p>
        </div>
        <ReactEasyUploader 
            fileList={fileList}
            uploadApi={uploadApi}
            inputName="uploadfile"
            parseResponse={parseResponse} 
            onFileListChange={onFileListChange}
            onException={onException}
            headers={headers}
            quality={0.8}
            maxSize={1024}
            maxCount={5}
            buttonName="Upload"
            frameStyle="square"
        />
        <Instruction />
    </React.Fragment>
);

render(<App />, document.getElementById("root"));