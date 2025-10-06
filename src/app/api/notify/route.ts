import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Subscription from '../../../models/Subscription';
import webpush from 'web-push';

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
};

webpush.setVapidDetails(
  process.env.VAPID_MAILTO || 'mailto:your_email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { title, body } = await req.json();
    const subscriptions = await Subscription.find({});

    const notificationPayload = JSON.stringify({ title, body });

    const promises = subscriptions.map(sub =>
      webpush.sendNotification(sub.toObject(), notificationPayload)
        .catch(err => {
          if (err.statusCode === 410) {
            // Subscription is no longer valid, remove from DB
            return Subscription.deleteOne({ _id: sub._id });
          } else {
            console.error('Error sending notification', err);
          }
        })
    );

    await Promise.all(promises);

    return NextResponse.json({ success: true, message: 'Notifications sent.' }, { status: 200 });
  } catch (error) {
    console.error('Error sending notifications', error);
    return NextResponse.json({ success: false, message: 'Failed to send notifications.' }, { status: 500 });
  }
}