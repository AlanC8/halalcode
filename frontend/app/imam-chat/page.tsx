"use client"
import React, { use, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { io, Socket } from 'socket.io-client'
import Message from '../pages/ui/message'
import { Input } from '../pages/ui/input'

interface MessageInterface {
  message: string;
  sender: string;
}

const ImamChat: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamId, setStreamId] = useState('');
  const [lastMessage, setLastMessage] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imamPhoto = '/images/imam-photo.jpg'; // Убедитесь, что путь к изображению правильный

  const systemPrompt = `You are an AI Islamic scholar specializing in the teachings and jurisprudence of Abu Hanifa...`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createStream = async () => {
    try {
      const response = await axios.post('https://api.d-id.com/talks/streams', {
        stream_warmup: 'false',
        source_url: imamPhoto,
      }, {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `Basic ${process.env.NEXT_PUBLIC_D_ID_API_KEY}`,
        },
      });
      const { id, session_id, offer, ice_servers } = response.data;
      return { id, session_id, offer, ice_servers };
    } catch (error) {
      console.error('Error creating stream:', error);
    }
  };

  const startStream = async (id: string, sessionClientAnswer: any, session_id: string) => {
    try {
      await axios.post(`https://api.d-id.com/talks/streams/${id}/sdp`, {
        answer: sessionClientAnswer,
        session_id,
      }, {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `Basic ${process.env.NEXT_PUBLIC_D_ID_API_KEY}`,
        },
      });
      return true;
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  const submitNetworkInformation = async (id: string, session_id: string, candidate: string, sdpMid: any, sdpMLineIndex: any) => {
    try {
      await axios.post(`https://api.d-id.com/talks/streams/${id}/ice`, {
        session_id,
        candidate,
        sdpMid,
        sdpMLineIndex,
      }, {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `Basic ${process.env.NEXT_PUBLIC_D_ID_API_KEY}`,
        },
      });
    } catch (error) {
      console.error('Error submitting network information:', error);
    }
  };

  const talkStream = async (id: string, session_id: string, input: string) => {
    try {
      await axios.post(`https://api.d-id.com/talks/streams/${id}`, {
        script: {
          type: 'text',
          provider: {
            type: 'microsoft',
            voice_id: 'en-US-JennyNeural',
          },
          ssml: 'false',
          input,
        },
        config: {
          fluent: 'false',
          pad_audio: '0.0',
        },
        audio_optimization: '2',
        session_id,
      }, {
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${process.env.NEXT_PUBLIC_D_ID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      setIsStreaming(true);
    } catch (error) {
      console.error('Error talk stream:', error);
    }
  };

  const createPeerConnection = async (id: string, session_id: string, ice_servers: any, offer: any) => {
    try {
      const peerConnection = new RTCPeerConnection({ iceServers: ice_servers });

      peerConnection.addEventListener('icecandidate', async (event) => {
        if (event.candidate) {
          try {
            const { candidate, sdpMid, sdpMLineIndex } = event.candidate;
            await submitNetworkInformation(id, session_id, candidate, sdpMid, sdpMLineIndex);
          } catch (error) {
            console.log('Error submitting network information:', error);
          }
        }
      });

      peerConnection.addEventListener('track', (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
        }
      });

      await peerConnection.setRemoteDescription(offer);
      const sessionClientAnswer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(sessionClientAnswer);
      return sessionClientAnswer;
    } catch (error) {
      console.error('Error creating peer connection:', error);
    }
  };

  const sendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages((prevMessages) => [...prevMessages, { message, sender: 'user' }]);
    try {
      const response = await axios.post('http://localhost:6161/api/imam-ai/ask', { question: message }); // URL должен совпадать с адресом вашего бэкенда
      const { response: gptResponse } = response.data;
      setMessages((prevMessages) => [...prevMessages, { message: gptResponse, sender: 'imam' }]);
      setLastMessage(gptResponse);
      setMessage('');
    } catch (error) {
      console.error('Error sending prompt:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      const data = await createStream();
      if (data) {
        const { id, session_id, offer } = data;
        const sessionClientAnswer = await createPeerConnection(id, session_id, data.ice_servers, offer);
        if (sessionClientAnswer) {
          await startStream(id, sessionClientAnswer, session_id);
          await talkStream(id, session_id, 'Hello there! How are you doing today?');
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (isStreaming) {
      videoRef.current?.setAttribute('playsinline', 'true');
      videoRef.current?.play();
    }
    setIsStreaming(false);
  }, [isStreaming]);

  useEffect(() => {
    const init = async () => {
      await talkStream(streamId, '1', lastMessage);
    };
    if (lastMessage !== '') {
      init();
    }
  }, [lastMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-full min-h-screen">
      <header className="top-0 left-0 w-full px-[8%] py-[30px] bg-transparent flex justify-between items-center font-mono absolute z-10 text-black">
        <Link href="/" className="text-[25px] font-semibold flex items-center justify-center gap-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.8696 12.8929H20.8696C20.8696 9.02294 17.7396 5.89294 13.8696 5.89294H12.8696V4.62294C13.4696 4.28294 13.8696 3.63294 13.8696 2.89294C13.8696 1.79294 12.9796 0.892944 11.8696 0.892944C10.7596 0.892944 9.86957 1.79294 9.86957 2.89294C9.86957 3.63294 10.2696 4.28294 10.8696 4.62294V5.89294H9.86957C5.99957 5.89294 2.86957 9.02294 2.86957 12.8929H1.86957C1.31957 12.8929 0.869568 13.3429 0.869568 13.8929V16.8929C0.869568 17.4429 1.31957 17.8929 1.86957 17.8929H2.86957V18.8929C2.86957 20.0029 3.76957 20.8929 4.86957 20.8929H18.8696C19.9796 20.8929 20.8696 20.0029 20.8696 18.8929V17.8929H21.8696C22.4196 17.8929 22.8696 17.4429 22.8696 16.8929V13.8929C22.8696 13.3429 22.4196 12.8929 21.8696 12.8929ZM20.8696 15.8929H18.8696V18.8929H4.86957V15.8929H2.86957V14.8929H4.86957V12.8929C4.86957 10.1329 7.10957 7.89294 9.86957 7.89294H13.8696C16.6296 7.89294 18.8696 10.1329 18.8696 12.8929V14.8929H20.8696V15.8929ZM10.5696 12.8929C10.9696 13.2829 10.9696 13.9429 10.5696 14.3429L9.83957 15.0729L8.36957 16.5429L6.16957 14.3429C5.76957 13.9429 5.76957 13.2829 6.16957 12.8929C6.57957 12.4729 7.22957 12.4729 7.63957 12.8929L8.36957 13.6129L9.09957 12.8929C9.50957 12.4729 10.1596 12.4729 10.5696 12.8929ZM17.5696 12.8929C17.9696 13.2829 17.9696 13.9429 17.5696 14.3429L16.8396 15.0729L15.3696 16.5429L13.1696 14.3429C12.7696 13.9429 12.7696 13.2829 13.1696 12.8929C13.5796 12.4729 14.2296 12.4729 14.6396 12.8929L15.3696 13.6129L16.0996 12.8929C16.5096 12.4729 17.1596 12.4729 17.5696 12.8929Z" fill="black" />
          </svg>
          Imam Ai
        </Link>
        <p className="text-xl text-center md:flex hidden">Nurlan Imam</p>
        <div className="flex gap-2 items-center justify-center">
          <p className="md:flex hidden text-[18px]">Guest</p>
        </div>
      </header>
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="w-[90%] md:w-[60%] md:h-screen min-h-1 md:py-[60px] py-[20px] md:pt-28 flex flex-wrap lg:flex-nowrap gap-4">
          <div className="w-full md:w-full lg:w-[70%] md:h-full h-[30vh] bg-cover bg-center rounded-[6px]" style={{ backgroundImage: `url(${imamPhoto})` }}>
            <video ref={videoRef} className="w-full h-full rounded-[6px] shadow-2xl object-cover object-center"></video>
          </div>
          <div className="w-full lg:w-[40%] md:h-full h-[40vh] shadow-xl border rounded-[6px] flex flex-col gap-4 p-4 overflow-auto custom-scrollbar">
            <div className="flex-grow">
              {messages.map((message, index) => (
                <Message key={index} message={message.message} sender={message.sender} />
              ))}
              <div ref={messagesEndRef} className="h-0 w-0" />
            </div>
            <form action="" className="flex justify-center items-center gap-4 mt-auto" onSubmit={sendPrompt}>
              <Input value={message} placeholder="Type message" onChange={(e) => setMessage(e.target.value)} onSubmit={sendPrompt} />
              <button type="submit" className="bg-[#000] text-[#FFF] px-4 py-2 rounded-[6px] transition[.3s]">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImamChat;
