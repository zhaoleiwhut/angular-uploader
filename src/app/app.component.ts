import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  form: any = {
    username: "Groucho",
    accountnum: 123456 // 数字123456会被立即转换成字符串 "123456"
  };
  file: File;
  chunk = 0;
  totalSize: number;
  eachSize: number;
  chunks: number;
  isPaused = false;

  getFormData(form, file, chunk) {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/Using_FormData_Objects
    const formData = new FormData();
    for (const key in form) {
      if (form.hasOwnProperty(key)) {
        formData.append(key, form[key]);
      }
    }
    formData.append('chunk', chunk);
    formData.append('chunks', String(this.chunks));
    const blobFrom = chunk * this.eachSize; // 分段开始
    const blobTo =
      (chunk + 1) * this.eachSize > this.totalSize
        ? this.totalSize
        : (chunk + 1) * this.eachSize; // 分段结尾
    // HTML 文件类型input，由用户选择
    const fileBlock = file.slice(blobFrom, blobTo);
    const filename = file.name;
    formData.append('file', fileBlock, filename);
    console.log(this.chunk, this.chunks);
    if (this.chunk + 1 === this.chunks) {
        formData.append('status', 'done');
    }
    return formData;
  }

  upload() {
    const formData = this.getFormData(this.form, this.file, this.chunk);
    this.send(formData);
  }

  send(formData: FormData) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/uploader/upload/", true);
    // xhr.setRequestHeader("Content-type", "multipart/form-data"); // application/json
    xhr.onload = () => {
      console.log("onload");
      this.chunk++;
      if (this.chunk + 1 > this.chunks) {
        return;
      }
      if (this.isPaused) {
        return;
      }
      this.upload();
    };
    //发送合适的请求头信息
    xhr.onreadystatechange = () => {
      console.log("onreadystatechange:", xhr.readyState);
      //Call a function when the state changes.
      if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        // 请求结束后,在此处写处理代码
        console.log("200");
      }
    };

    // https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/send
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Submitting_forms_and_uploading_files
    // https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest
    xhr.send(formData);
  }

  handleClick(fileInput) {
    console.log(fileInput);
    this.isPaused = false;
    this.file = fileInput.files[0];
    this.chunk = 0;
    this.totalSize = this.file.size;
    this.eachSize = 1024;
    this.chunks = Math.ceil(this.totalSize / this.eachSize);
    this.upload();
  }

  pause() {
    this.isPaused = true;
  }

  continueUpload() {
    this.isPaused = false;
    this.upload();
  }
}
