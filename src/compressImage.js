export function getImageBase64(file) {
  return new Promise(
    (resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result); // done
      reader.onerror = error => reject(error);  // fail
    }
  );
}

// file: type is File
// quality: 0 < quality < 1.0
// maxSize: allowed max size of both width and height
export default function compressImage(file, quality, maxSize) {
    
    return new Promise(
  
        (resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (/*e*/) => {
            
            if (reader.result)
              resolve(reader.result);  // or use resolve(e.target.result)
            else 
              reject(false);
          };
          reader.onerror = () => {
            reject(false);
          }
  
        }
  
      ).then(
  
        (loadedResult) => {
  
          return new Promise(
  
            (resolve, reject) => {
              let imageObj = new Image();
              imageObj.src = loadedResult;
              imageObj.onload = function() {
                resolve(imageObj);
              };
              imageObj.onerror = function() {
                reject(false);
              };
            }
          );
        }
  
      ).then(
  
        (imageObj) => {
            
            // calculate scale rate
            let scaleRate = 1;
            if (imageObj.naturalWidth > imageObj.naturalHeight) {
                if (imageObj.naturalWidth > maxSize)
                    scaleRate = maxSize / imageObj.naturalWidth;
            } else {
                if (imageObj.naturalHeight > maxSize)
                    scaleRate = maxSize / imageObj.naturalHeight;
            }

            // check if need to compress
            if (scaleRate === 1 && quality == 1) {
                return file;    // do not compress
            }

            // execute compressing
            let newWidth = imageObj.naturalWidth * scaleRate;
            let newHeight = imageObj.naturalHeight * scaleRate;
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let widthNode = document.createAttribute("width");
            let heightNode = document.createAttribute("height");
            widthNode.nodeValue = newWidth;
            heightNode.nodeValue = newHeight;
            canvas.setAttributeNode(widthNode);
            canvas.setAttributeNode(heightNode);
            ctx.fillRect(0, 0, newWidth, newHeight);
            ctx.drawImage(imageObj, 0, 0, newWidth, newHeight);

            const base64 = canvas.toDataURL("image/jpeg", quality); // if type is "image/jpeg" or "image/webp", can set a quality (0,1)
            const bytes = window.atob(base64.split(',')[1]);
            const ab = new ArrayBuffer(bytes.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }
            let blob = new Blob([ab], {type: "image/jpeg"});
            const newFile = new File([blob], file.name, {type: "image/jpeg"});
            return newFile;
        }
  
      ).catch(
        () => {
          return false;
        }
      );
}