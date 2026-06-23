import { NextResponse } from 'next/server';
import axios from 'axios';

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000/api/v1';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Envoyer une notification via le service notification (email à l'agent)
    const res = await axios.post(`${API_GATEWAY_URL}/notifications`, {
      type: 'CONTACT_FORM',
      recipient: {
        email: body.agentEmail,
      },
      content: {
        title: `Nouveau message de ${body.name}`,
        body: body.message,
        data: {
          senderEmail: body.email,
          propertyId: body.propertyId,
        },
      },
      channel: { channels: ['email'] },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Échec de l'envoi" }, { status: 500 });
  }
}
