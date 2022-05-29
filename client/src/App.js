import React, { useState, useEffect } from 'react';
import Title from "./Title";
import Content from "./Content";
// import Article from "./Article";
function Article(props) {
  return (
    <div>
      <Title Value={props.Title} />
      <Content Value={props.Content} />
    </div>
  );
}

function App() {
  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch("/articles").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
    // console.log(backendData);
  }, []);

  return (
    <div className="App">
      <h1>Wiki</h1>
      {
        (typeof backendData.articles === 'undefined' ? (
          <p>Loading...</p>
        ) :
          (
            backendData.articles.map((article, i) => {
              console.log(i);
              console.log(article);
              return <Article Key={i} Title={article.title} Content={article.content} />
            })

          ))
      }
      {/* <Article Title={backendData.title}/> */}
    </div>
  );
}

export default App;
