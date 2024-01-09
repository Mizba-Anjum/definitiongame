import React, { useState, useEffect } from "react";
import  { Amplify } from 'aws-amplify';
import { generateClient } from "aws-amplify/api";
import awsconfig from './aws-exports';
import { getWord, listWords } from './graphql/queries'

Amplify.configure(awsconfig);
const client = generateClient();

function GetMessage() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchWords();
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
            msgString = msgString.concat(" in 20 words or less")

            setMessage(msgString);
        } catch (err) {
            console.log('Error fetching words: ', err);
        }
    }

    return (message);
  }
  
  export default GetMessage