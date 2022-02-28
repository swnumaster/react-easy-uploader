# Introduction

    A React component by which you can upload images into server with compressing.
    Demo: https://swnumaster.github.io/react-easy-uploader/
    Author: Nathan Jiang (373578963@qq.com)

# Installation

    npm install react-easy-uploader

# Usage
```javascript
    import React from 'react';
    import { render } from 'react-dom';
    import ReactEasyUploader from 'react-easy-uploader';

    let fileList = [
        {url: "https://blog.chueasy.com/wp-content/themes/easyportalpro/images/default/slide1.jpg", filename: "slide1.jpg"},
        {url: "https://blog.chueasy.com/wp-content/themes/easyportalpro/images/default/slide2.jpg", filename: "slide2.jpg"},
        {url: "https://blog.chueasy.com/wp-content/themes/easyportalpro/images/default/slide3.jpg", filename: "slide3.jpg"},
    ];

    let headers = {token: "NDQ4MDI4MzI4NTkzODc2OTkyMXwxNjIyNzA5MTg2LjcxNzUzMjk6YWRmNTRjNmUwOTU4YmM5MzQ1YTQyYjBkNDczMjBjNGNmNjVhMzkyZg=="};

    let uploadApi = "/api/image/upload";

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

    const MyComponent = () => (
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
            maxCount={4}
        />
    );

    render(<MyComponent />, document.getElementById(node));
```

# Change log

    v1.0.1

        ignore unecessary files