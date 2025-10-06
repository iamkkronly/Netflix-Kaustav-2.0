import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Subscription from '../../../models/Subscription';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const subscriptionData = await req.json();
    const subscription = new Subscription(subscriptionData);
    await subscription.save();
    return NextResponse.json({ success: true, message: 'Subscription saved.' }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: 'Subscription already exists.' }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: 'Failed to save subscription.' }, { status: 500 });
  }
}