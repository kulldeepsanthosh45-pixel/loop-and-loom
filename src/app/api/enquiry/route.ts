import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message, type = 'GENERAL', productId } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required fields' },
        { status: 400 }
      );
    }

    // In production with PostgreSQL/Prisma:
    // const enquiry = await prisma.enquiry.create({
    //   data: { name, email, phone, message, type, productId },
    // });

    return NextResponse.json({
      success: true,
      message: 'Enquiry received. Our studio artisans will contact you shortly.',
      id: `enq_${Date.now()}`,
    });
  } catch (error: any) {
    console.error('Enquiry submission error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}
