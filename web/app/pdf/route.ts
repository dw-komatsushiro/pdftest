'use server'
import { NextResponse } from 'next/server';


export async function GET() {
    const res = await fetch('http://localhost:8088/pdf?fileName=example&dataId=sampleData&withSeal=true&name=テスト テスト様&note=サンプル&quantity=10' )

    return new NextResponse(res.body, {
        status: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${encodeURIComponent('example.pdf')}"`,
            'Cache-Control': 'public, max-age=60, must-revalidate',
        },
    });
}