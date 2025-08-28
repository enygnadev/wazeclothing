
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        status: "error",
        error: errorMessage 
      },
      { status: 500 }
    )
  }
}
