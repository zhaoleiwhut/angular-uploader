import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "demo";
  file: any;

  upload(file) {
    console.log(file);
    console.log(this.file);

    const formData = new FormData();
    formData.append("username", "Groucho");
    formData.append("accountnum", "123456"); //数字123456会被立即转换成字符串 "123456"
    // HTML 文件类型input，由用户选择
    formData.append("userfile", file.files[0], "sss.json");
    this.send(formData);
  }

  send(formData: FormData) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/uploader/upload/", true);
    // xhr.setRequestHeader("Content-type", "multipart/form-data"); // application/json
    xhr.onload = function() {
      console.log("onload");
    };
    //发送合适的请求头信息
    xhr.onreadystatechange = function() {
      console.log("onreadystatechange:", xhr.readyState);
      //Call a function when the state changes.
      if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        // 请求结束后,在此处写处理代码
        console.log("200");
      }
    };
    xhr.send(formData);
  }
}
