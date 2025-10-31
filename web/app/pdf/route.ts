'use server'
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
    return fetch('http://localhost:8088/pdf?fileName=example&dataId=sampleData&withSeal=true')
}