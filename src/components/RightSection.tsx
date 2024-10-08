"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/RightSection.module.css';
import chatgptlogo from '@/assets/chatgptlogo.png';
import chatgptlogo3 from '@/assets/chatgptlogo3.png';
import nouserlogo from '@/assets/nouserlogo.png';
import Image from 'next/image';
import { HashLoader } from 'react-spinners';
import ReactMarkdown from 'react-markdown';

const RightSection = () => {
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(true);
    const [allMessages, setAllMessages] = useState<any[]>([]);
    const [error, setError] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    // Referencia para rastrear el montaje inicial
    const isInitialMount = useRef(true);

    // Cargar mensajes desde localStorage al montar el componente
    useEffect(() => {
        const storedMessages = localStorage.getItem('chatMessages');
        if (storedMessages) {
            const parsedMessages = JSON.parse(storedMessages);
            setAllMessages(parsedMessages);
            console.log('Mensajes cargados desde localStorage:', parsedMessages);
        }
    }, []);

    // Guardar mensajes en localStorage cada vez que cambian, excepto en el montaje inicial
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            localStorage.setItem('chatMessages', JSON.stringify(allMessages));
            console.log('Mensajes guardados en localStorage:', allMessages);
        }
    }, [allMessages]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [allMessages]);

    const sendMessage = async () => {
        if (!message.trim()) return; // Evita enviar mensajes vacíos

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3013';
        const url = `${backendUrl}/lang-chain/text`;

        const messagePayload = {
            text: message
        };

        setIsSent(false);
        setError(null); // Reinicia el estado de error

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messagePayload)
            });

            if (!res.ok) {
                throw new Error(`Error en la solicitud: ${res.statusText}`);
            }

            const resjson = await res.json();

            // Asegúrate de que la respuesta tiene la estructura esperada
            if (!resjson.answer || !resjson.answer.cleanedResult) {
                throw new Error('Respuesta inesperada del backend');
            }

            const responseMessage = resjson.answer.cleanedResult;

            const newAllMessages = [
                ...allMessages,
                {
                    role: "user",
                    parts: [{ text: message }]
                },
                {
                    role: "model",
                    parts: [{ text: responseMessage }]
                }
            ];

            setAllMessages(newAllMessages);
            setMessage('');
        } catch (error) {
            console.error(error);
            setError('Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.');
        } finally {
            setIsSent(true);
        }
    };

    const handleResetChat = async () => {
        setAllMessages([]); // Limpia los mensajes en el estado
        localStorage.removeItem('chatMessages'); // Limpia localStorage
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3013';
        const url = `${backendUrl}/lang-chain/clear-chat-history`; // Asegúrate de que esta URL sea la correcta
    
        try {
            const res = await fetch(url, {
                method: 'DELETE', // Cambiado a DELETE
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!res.ok) {
                throw new Error(`Error en la solicitud: ${res.statusText}`);
            }
    
            const resjson = await res.json();
            console.log(resjson.message); // Mensaje de éxito de la respuesta
        } catch (error) {
            console.error('Error al borrar el historial de chat:', error);
        }
    };

    return (
        <div className={styles.rightSection}>
            <div className={styles.rightin}>
                <div className={styles.chatgptversion}>
                    <p className={styles.text1}>Eprezto Support Chat</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>

                {allMessages.length > 0 ? (
                    <div className={styles.messages} >
                        {allMessages.map((msg, index) => (
                            <div key={index} className={styles.message}  ref={messagesEndRef}>
                                <Image src={msg.role === 'user' ? nouserlogo : chatgptlogo3} width={50} height={50} alt="" />
                                <div className={styles.details}>
                                    <h2>{msg.role === 'user' ? 'You' : 'EPREZTO-GPT Bot'}</h2>
                                    {msg.role === 'model' ? (
                                        <ReactMarkdown
                                            components={{
                                                a: ({ href, children }) => (
                                                    <a href={href} target="_blank" rel="noopener noreferrer">
                                                        {children}
                                                    </a>
                                                )
                                            }}
                                            className={styles.markdown}
                                        >
                                            {msg.parts[0].text}
                                        </ReactMarkdown>

                                    ) : (
                                        <p>{msg.parts[0].text}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.nochat}>
                        <h1>How can I help you today?</h1>
                    </div>
                )}

                {/* Mostrar mensaje de error si existe */}
                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.bottomsection}>
                    <div className={styles.messagebar}>
                        <input
                            type="text"
                            placeholder="Message EPREZTO-GPT Bot..."
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault(); // Prevenir comportamiento por defecto
                                    sendMessage();
                                }
                            }}
                        />
                        {isSent ? (
                            <>
                                <svg
                                    onClick={sendMessage}
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                </svg>
                                <button onClick={handleResetChat} className={styles.resetButton}>
                                    Reset Chat
                                </button>
                            </>
                        ) : (
                            <HashLoader color="#483A9C" size={30} />
                        )}
                    </div>
                    <p>EPREZTO-GPT BOT can make mistakes. Consider checking important information.</p>
                </div>
            </div>
        </div>
    );
}

export default RightSection;
