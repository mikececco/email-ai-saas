'use server'

import { auth } from "@clerk/nextjs/server"
import axios from 'axios'

export const getAurinkoAuthUrl = async (serviceType: 'Google' | 'Office365') => {
    
    const {userId} = await auth() //clerk

    if (!userId) throw new Error('User not found');

    const params = new URLSearchParams({
        clientId: process.env.AURINKO_CLIENT_ID as string,
        serviceType,
        scopes: 'Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All',
        responseType: 'code',
        returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`,
    });    

    console.log(`https://api.aurinko.io/v1/auth/authorize?${params.toString()}`);

    return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`;
}

export const exchangeCodeForAccessToken = async (code: string) => {
    try {
        const response = await axios.post(`https://api.aurinko.io/v1/auth/token/${code}`, {}, {
            auth: {
                username: process.env.AURINKO_CLIENT_ID as string,
                password: process.env.AURINKO_CLIENT_SECRET as string
            }
        })
        console.log('EXCHAnged TOKEN:');
        
        console.log(response.data);

        return response.data as {
            accountId: number,
            accessToken: string,
            userId: string,
            userSession: string
        }

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(error.response?.data)
        } else {
            console.error('Unexpected')
        }
        throw error
    }
}

export const getAccountDetails = async (accessToken: string) =>  {
    try {
        const response = await axios.get('https://api.aurinko.io/v1/account', {
            headers: {
                'Authorization': `Bearer ${accessToken}` //accessToken specific to user
            }
        })

        return response.data as {
            email: string,
            name: string
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(error.response?.data)
        } else {
            console.error('Unexpected')
        }
        throw error
    }
}