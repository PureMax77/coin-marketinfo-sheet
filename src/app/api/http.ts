import { NextResponse } from "next/server";

export async function http<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  const data = await response.json();

  return data;
}
