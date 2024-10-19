import axios from "axios"
import { EmailMessage, SyncResponse, SyncUpdatedResponse } from "./types"
import { string } from "zod"
import { db } from "~/server/db"

const API_BASE_URL = 'https://api.aurinko.io/v1';

export class Account {
    private token: string

    constructor(token: string){
        this.token = token
    }

    private async startSync() {
        console.log('INSIDE START SYNC');
        
        const response = await axios.post<SyncResponse>('https://api.aurinko.io/v1/email/sync', {}, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
            params: {
                daysWithin: 2,
                bodyType: 'html'
            }
        })
        console.log('RESPONSE FROM START SYNC');
        console.log(response.data);
        
        return response.data
    }

    async getUpdatedEmails({ deltaToken, pageToken }: { deltaToken?: string, pageToken?: string }): Promise<SyncUpdatedResponse> {
        console.log('getUpdatedEmails', { deltaToken, pageToken });
        try {
            const response = await axios.get<SyncUpdatedResponse>(
                `${API_BASE_URL}/email/sync/updated`,
                {
                    params: { deltaToken, pageToken },
                    headers: { Authorization: `Bearer ${this.token}` }
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('API Error:', error.response.data);
                throw new Error(`API Error: ${error.response.data.message || 'Unknown error'}`);
            }
            throw error;
        }
    }

    async performInitialSync() {
        try {

            console.log('INSIDE performInitialSync and here is the token: ', this.token);
                        
            let syncResponse = await this.startSync()

            console.log('BACK TO performInitialSync');
            
            while (!syncResponse.ready) {
                await new Promise(resolve => setTimeout(resolve, 1000))
                syncResponse = await this.startSync()
            }

            //get the bookmark delta token
            let storedDeltaToken: string = syncResponse.syncUpdatedToken
            console.log('BACK TO getUpdatedEmails');
            let updatedResponse = await this.getUpdatedEmails({deltaToken: syncResponse.syncUpdatedToken})
            console.log('OUT OF getUpdatedEmails');
            if (updatedResponse.nextDeltaToken){
                storedDeltaToken = updatedResponse.nextDeltaToken
            }

            let allEmails : EmailMessage[] = updatedResponse.records //new emails

            //fetch all pages if there are more

            while (updatedResponse.nextPageToken) {
                console.log('LOOOOP TO getUpdatedEmails');
                
                updatedResponse = await this.getUpdatedEmails({pageToken : updatedResponse.nextPageToken })
                allEmails = allEmails.concat(updatedResponse.records)

                if (updatedResponse.nextDeltaToken) {
                    //sync finished
                    storedDeltaToken = updatedResponse.nextDeltaToken
                }
            }
            console.log('Initial sync completed');

            //store latest delta token

            return {
                emails: allEmails,
                deltaToken: storedDeltaToken
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
}
