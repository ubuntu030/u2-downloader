import { useState } from "react";
import './App.css';
import DownloadPage from "./components/DownloadPage";
import List from "./components/List";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [list, setList] = useState([]);
  // TODO: loading

  /**
   * 影片轉成為mp3
   * @param {Object} info 
   * @param {String} info.path 檔案路徑
   */
  function convertVideo(info) {
    try {
      fetch('http://localhost:8080/convert', {
        method: 'POST',
        body: JSON.stringify(info),
        headers: {
          'content-type': 'application/json'
        },
      })
        .then(resp => resp.json())
        .then(data => {
          if (data && data.errmsg) {
            console.error(data.errmsg);
            return;
          }
          const file = data.file;
          // 檢查資料是否存在
          // let fltedinfo = list.filter(info => info.id === file.id);
          // let fltedinfoObj = fltedinfo[0];
          const nArr = list.map(item => {
            return (item.id === file.id) ? file : item;
          });
          setList(nArr)
          console.log(list);
          // TODO: popup and show success or fail
        }, error => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
      throw new Error("Whoops!");
    }
  }

  return (
    <div className="App">
      <List list={list} handleConvert={convertVideo} />
      <DownloadPage list={list} setList={setList} />
    </div>
  );
}

export default App;
