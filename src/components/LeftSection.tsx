import React from 'react'
import chatgptlogo from '@/assets/chatgptlogo.png'
import epreztologo1 from '@/assets/eprezto-logo1.png'
import OpenAILogoVersion1 from '@/assets/OpenAI-Logo-Version-1.png'
import Image from 'next/image'
import styles from '@/styles/LeftSection.module.css'


const LeftSection = () => {

    const allChats = [
        {
            id: 1,
            chatName: 'Consulta sobre el seguro para el vehículo con matrícula ABC123',
        },
        {
            id: 2,
            chatName: 'Información sobre el estado del pago para la matrícula XYZ456',
        },
        {
            id: 3,
            chatName: 'Emisión de la póliza para el cliente con el correo ejemplo@gmail.com',
        }
    ];
    return (
        <div className={styles.leftSection}>
            <div className={styles.newChat}>
                <div>
                    <Image src={epreztologo1} alt="ChatGPT" width={50} height={50} />
                    <p className={styles.text1}>CHATGPT BOT</p>

                </div>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>

            </div>
            <div className={styles.allChats}>
                {allChats.map(chat => (
                    <div key={chat.id} className={styles.chat}>
                        <p className={styles.text1}>{chat.chatName}</p>

                    </div>
                ))}
            </div>
            <div className={styles.newChat}>
                <div className={styles.logoContainer}>
                    <Image src={OpenAILogoVersion1} alt="OpenAI Logo" className={styles.logo} />
                </div>
            </div>

        </div>
    )
}

export default LeftSection