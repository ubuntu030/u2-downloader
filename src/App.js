import { useState } from "react";
import './App.css';
import Form from "./components/Form";
import List from "./components/List";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [list, setList] = useState([]);
  // TODO: loading

  return (
    <div className="App">
      <List list={list} handleConvert={convertVideo} />
      <Form list={list} setList={setList} />
    </div>
  );
}
/**
 * 影片轉成為mp3
 * @param {String} path 檔案路徑
 */
async function convertVideo(info) {
  try {
    let resp = await fetch('http://localhost:8080/convert', {
      method: 'POST',
      body: JSON.stringify(info),
      headers: {
        'content-type': 'application/json'
      },
    });
    // TODO: popup and show success
    return await resp.json();
  } catch (err) {
    console.log(err);
    throw new Error("Whoops!");
  }
}

export default App;
