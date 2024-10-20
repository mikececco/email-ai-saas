import { db } from "~/server/db";
import { EmailAddress, EmailMessage } from "./types";
import pLimit from 'p-limit'

export async function syncEmailsToDatabase(emails: EmailMessage[], accountId: string){
    console.log('attempting to sync', emails.length);

    //p-limit aka Promise Limit
    const limit = pLimit(10)

    try {
        await Promise.all(emails.map((email, index) => upsertEmail(email, accountId, index))) //concurrent database connections
        
    } catch (error) {
        console.error(error);
    }

    
}

async function upsertEmail(email: EmailMessage, accountId: string, index: number) {
    console.log('upserting email', index);
    try {
        let emailLabelType: 'inbox' | 'sent' | 'draft' = 'inbox'

        if (email.sysLabels.includes('inbox') || email.sysLabels.includes('unread') || email.sysLabels.includes('important')) {
            emailLabelType = 'inbox'
        } else if (email.sysLabels.includes('sent')){
            emailLabelType = 'sent'
        } else if (email.sysLabels.includes('draft')){
            emailLabelType = 'draft'
        }

        const addressesToUpsert = new Map()

        for (const address of [email.from, ...email.to, ...email.cc, ...email.bcc, ...email.replyTo]) { //Collect all unique email addresses involved in the email (sender, recipients, CC, BCC, reply-to).
            addressesToUpsert.set(address.address, address) //mapping from address objects to address objects, using the email address string as the key.
        }

        for (const address of addressesToUpsert.values()) {
            const upsertAddress = await upsertEmailAddress(address, accountId)
        }
    } catch (error) {
        
    }
}

async function upsertEmailAddress(address: EmailAddress, accountId: string) {
    try {
        const existingAddress =  await db.emailAddress.findUnique({
            where: {accountId_address : {accountId: accountId, address: address.address ??  ''}} //accountId_address: This is likely a compound unique constraint defined in your Prisma schema. It suggests that the combination of accountId and address must be unique in the table, defined by @@unique([accountId, address]) in model EmailAddress
        })

        if (existingAddress) {
            return await db.emailAddress.update({
                where: {
                    id: existingAddress.id
                },
                data: {
                    name: address.name, raw: address.raw
                }
            })
        } else {
            return await db.emailAddress.create({
                data: {address: address.address ?? '', name: address.name, raw: address.raw, accountId}
            })
        }
    } catch (error) {
        console.error('Failed to upsert');
        return null
    }
}