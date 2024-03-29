import React, { useEffect, useState, useContext } from "react";
import { socketConnection } from "../../socket";
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import './helpCenter.css'
import axios from "axios";
import userContext from "../../context/UserContext";
import MapBox from "../../components/MapBox/MapBox";

const HelpCenter = () => {
  const [socket, setSocket] = useState(null)
  const [message, setMessage] = useState('')
  const [resMessage, setResMessage] = useState([])
  const [showChatBox, setShowChatBox] = useState(false)
  const [closeChatBox, setCloseChatBox] = useState(false)

  const { loginResponse } = useContext(userContext)

  const sendMessage = async (message) => {
    const body = {
      userId: loginResponse.data.user._id,
      message: message
    }
    const { data: { chatDetails } } = await axios.post(`${process.env.REACT_APP_ENDPOINT}/chat/with/us`, body)
    console.log(message)
    socket?.emit('message', chatDetails)
    setMessage('')
  }

  const getMessage = () => {
    console.log("get messaged called", socket)
    socket?.on('getMessage', data => setResMessage(prev => ([...prev, data])))
    console.log('Message from backend', resMessage)
  }

  const showChatBoxHandler = (e) => {
    console.log('Chat box clicked')
    getMessage()
    console.log('User connected')
    setShowChatBox(true)
    setCloseChatBox(true)
  }

  const closeChatBoxHandler = () => {
    console.log('close button clicked')
    setShowChatBox(false)
    setCloseChatBox(false)
  }

  useEffect(() => {
    setSocket(socketConnection.connect())
  }, [])

  useEffect(() => {
    getMessage()
  }, [])

  return (
    <div>
      {/* CHAT BOX */}
      <div className="chat_box" style={{ display: showChatBox ? 'block' : 'none' }}>
        <h2>Chat with us &emsp; <CloseIcon
          onClick={() => closeChatBoxHandler()}
          style={{ cursor: 'pointer' }} /></h2>
        <div className="chat_section">
          {
            resMessage.map((el, i) => {
              return <p
                key={`chat${i}`}
                style={{
                  textAlign: el.userId == loginResponse.data.user._id ? 'right' : 'left',
                  color: el.userId == loginResponse.data.user._id ? '#001a4d' : ' #004d00'
                }}>
                <span style={{
                  background: el.userId == loginResponse.data.user._id ? '#001a4d' : ' #004d00',
                  color: 'white',
                  borderRadius: '2px',
                  padding: '2px'
                }}>{el.chat}</span>
              </p>
            })
          }
        </div>
        <div className="input_container">
          <input
            className="chat_input"
            style={{ border: '1px solid black', width: '12.8rem' }}
            type="text" name="chat" value={message}
            onChange={e => { setMessage(e.target.value) }}
            onKeyDown={(e) => e.key == 'Enter' && sendMessage(message)}
            placeholder="Type message"
            autoComplete="off"
          />
          <div className="send_btn">
            <SendIcon
              onClick={() => sendMessage(message)}
            />
          </div>
        </div>
      </div>

      {/* CHAT ICON */}
      <div
        style={{ visibility: closeChatBox ? 'hidden' : 'visible' }}
        className="floating_btn">
        <ChatIcon onClick={(e) => showChatBoxHandler(e)} />
      </div>
      <h1 className="text-2xl font-medium title-font mb-5 mt-5 text-gray-900 tracking-widest">Help Center</h1>

      <section className="text-gray-600 body-font relative">
        <div className="container px-5 flex sm:flex-nowrap flex-wrap">
          <MapBox />
          <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto">
            <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
            Share your thoughts
            </h2>
            <div className="relative mb-4">
              <label htmlFor="name" className="leading-7 text-sm text-gray-600">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="off"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-sm text-gray-600">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="off"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="message" className="leading-7 text-sm text-gray-600">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
              ></textarea>
            </div>
            <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg help_button">
              Send Us
            </button>
          </div>
        </div>
      </section>
    </div >
  );
};

export default HelpCenter;
