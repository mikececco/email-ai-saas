import axios from "axios"
import { SyncResponse } from "./types"

export class Account {
    private token: string

    constructor(token: string){
        this.token = token
    }

    private async startSync() {
        const response = await axios.post<SyncResponse>('https://api.aurinko.io/v1/email/sync', {}, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
            params: {
                daysWithin: 2,
                bodyType: 'html'
            }
        })
        return response.data
    }

    async performInitialSync() {
        try {
            let syncResponse = await this.startSync(

            )
        } catch (error) {
            
        }
    }
}