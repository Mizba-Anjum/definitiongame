import './App.css';
import React, { useState, useEffect } from "react";
import  { Amplify } from 'aws-amplify';
import { generateClient } from "aws-amplify/api";
import awsconfig from './aws-exports';
import { getWord, listWords } from './graphql/queries'
import Cross from './cross.svg';
import Check from './check.svg';
import OpenAI from "openai";


const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true 
});





Amplify.configure(awsconfig);
const client = generateClient();

function App() {
  const [mainWord, setMainWord] = useState("");
  const [message, setMessage] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [won, setWon] = useState(false);
  const [prompt, setPrompt] = useState("");

  function getPrompt(msg) {
    openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: msg}]
    }).then(res => {
        setPrompt(res.choices[0].message.content)
    })
  }

    useEffect(() => {
        fetchWords().then((value) => {getPrompt(value)});
    }, []);
    
    const fetchWords = async () => {
        try {
            const wordsData = await client.graphql({ query: listWords});
            const wordList = wordsData.data.listWords.items;
            const wordnum = Math.floor(Math.random() * wordList.length);
            const wordData = await client.graphql({ query:getWord, variables: {id: wordnum} });

            var msgString = "Describe the word " + wordData.data.getWord['mainWord'] + " without using the words " + wordData.data.getWord['mainWord'] + ", " + wordData.data.getWord['complement1']
            if (wordData.data.getWord['complement2']) {
                msgString = msgString.concat(", " + wordData.data.getWord['complement2']);
            }
            if (wordData.data.getWord['complement3']) {
                msgString = msgString.concat(", " + wordData.data.getWord['complement3']);
            }
            if (wordData.data.getWord['complement4']) {
                msgString = msgString.concat(", " + wordData.data.getWord['complement4']);
            }
            if (wordData.data.getWord['complement5']) {
                msgString = msgString.concat(", and " + wordData.data.getWord['complement5']);
            }
            msgString = msgString.concat(" in 20 words or less");

            setMainWord(wordData.data.getWord['mainWord']);
            setMessage(msgString);
            return msgString;
        } catch (err) {
            console.log('Error fetching words: ', err);
        }
    }

    const handleSubmit = (event) => {
      event.preventDefault();
      var regex = /^[a-zA-Z]+$/;
      if (newItem.trim().toLowerCase() === mainWord) {
        setWon(true);
      }
      if (regex.test(newItem.trim()) && newItem.trim().toLowerCase() !== mainWord && !items.includes(newItem.trim().toLowerCase())) {
        getPrompt(message);
        setNewItem("");
        setItems([newItem.trim().toLowerCase(), ...items]);
      }
    };
  
    const handleChange = (event) => {
      setNewItem(event.target.value);
    };

    const handleReplay = (event) => {
      window.location.reload();
    }

  return (
    <div className='container d-flex flex-column align-items-center pt-5'>
      <h1 className='text-white'>Definitiondo</h1>
      <p className='text-white text-center'>The AI will describe a word for you. You must guess the word. The AI will try again after each guess, so give it some time!</p>
      <div className='border border-white p-3 w-50 text-white'>{prompt}</div>

      {won ?
        <div className='d-flex flex-column align-items-center'><h2 className='text-white mt-3'>
          You win! The word was {mainWord}!
        </h2>
        <button onClick={handleReplay} className='btn btn-light w-25'>Replay?</button></div>
        :
      <div className='w-50'>

      <form className='text-white w-100 mt-5' onSubmit={handleSubmit}>
        <label className='form-group w-75 pe-2'>
          Guess the word:
          <input type="text" className="form-control w-100" value={newItem} onChange={handleChange} />
        </label>
        <input type="submit" value="submit" className='btn btn-light w-25'  />
      </form>
</div>
      }
      <ul className='text-white w-50 mt-5 list-unstyled text-break'>
        {won && <li  key={mainWord} className='border border-white p-2 d-flex justify-content-between'>
            <div>{mainWord}</div>
          <img src={Check} style={{width:20}} alt="Check mark"/>
          </li>}
        {items.map((i) => {
          return <li  key={i} className='border border-white p-2 d-flex justify-content-between'>
            <div>{i}</div>
          <img src={Cross} style={{width:20}} alt="Cross mark"/>
          </li>;
        })}
        
      </ul>
      
    </div>
  );
}

export default App;
