
import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        env: {
          nodeEnv: process.env.NODE_ENV,
          hasFirebaseConfig: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        }
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        status: "error",
        error: error.message 
      },
      { status: 500 }
    )
  }
}
