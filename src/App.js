import { useState, useEffect } from "react";
import './App.css';
import DownloadPage from "./components/DownloadPage";
import List from "./components/List";
import Loading from "./components/Loading";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [list, setList] = useState([]);
  const [dwnloading, setDwnloading] = useState(false);

  useEffect(() => {
    fetchFileList(setList);
  }, []);
  /**
   * 影片轉成為mp3
   * @param {Object} info 
   * @param {String} info.path 檔案路徑
   */
  function convertVideo(info) {
    try {
      return fetch('http://localhost:8080/convert', {
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
            throw new Error(data.errmsg);
          }
          let { file } = data;
          // 資料修改 *刪除該筆舊資料後加入新的
          const nList = list.filter(item => item.id !== file.id);
          setList(list => [...nList, file]);

          // TODO: popup and show success or fail
        }, error => {
          console.log(error.message);
        });
    } catch (err) {
      console.log(err);
      throw new Error("Whoops!");
    }
  }
  // FIXME: loading時，所有 Button皆會變成loading 須個別處理
  return (
    <div className="App">
      <Loading isLoading={dwnloading} />
      <List list={list} handleConvert={convertVideo} />
      <DownloadPage list={list} setDwnloading={setDwnloading} setList={setList} />
    </div>
  );
}
/**
 * 從 video_info.json 取得資料
 * @param {Funciton} setList 更新清單資料
 */
function fetchFileList(setList) {
  if (!(setList && typeof setList === 'function')) {
    return;
  }
  let list = [];
  return fetch('http://localhost:8080/listInfo', {
    method: 'GET'
  })
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp && resp.errmsg) {
        console.error(resp.errmsg);
        return;
      }
      const data = resp.data;
      if (Array.isArray(data) && data.length > 0) {
        list = [...data];
        // setList(list);
      }
      return fetch('http://localhost:8080/list', {
        method: 'GET'
      })
    })
    .then((resp) => resp.json())
    .then(resp => {
      if (resp.errmsg) {
        console.error(resp.errmsg);
        return;
      }
      const { list: resList, path } = resp.data;
      let fileName = '';
      const nList = [...list].map(item => {
        fileName = item.name + item.ext;
        if (resList.includes(fileName)) {
          item.audioPath = path + '\\' + fileName;
        }
        return item;
      });
      // setList(arr => arr.concat(nList));
      setList(arr => arr.concat(nList))
      console.log(nList);
    });
}

export default App;
