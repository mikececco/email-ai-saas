import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function POST(req: NextRequest) {
    const { data } = await req.json();

    console.log(' HERE IS DATA:');
    console.log(data);

    const emailAddress = data.email_addresses[0].email_address;
    const firstName = data.first_name;
    const lastName = data.last_name;
    const imageUrl = data.image_url;
    const id = data.id;

    console.log('GOING TO UPSERT USER');

    try {
        const user = await db.user.upsert({
            where: { id: id },
            update: {
                emailAddress,
                firstName,
                lastName,
                imageUrl,
            },
            create: {
                id,
                emailAddress,
                firstName,
                lastName,
                imageUrl,
            },
        });

        console.log('User upserted:', user);

        return NextResponse.json({ message: 'User processed successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error processing user:', error);
        return NextResponse.json({ message: 'Error processing user' }, { status: 500 });
    }
}
