import React, { useState } from "react";
import GetMessage from './GetMessage';
import OpenAI from "openai";


const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true
});

let description = <GetMessage/>




function WriteMessage() {
    const [message, setMessage] = useState("");

    try {
        openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: description }]
        }).then(res => {
            setMessage(res)
        })
    
    } catch (err) {
        console.log(err)
    }
    return message;
}

export default WriteMessage;