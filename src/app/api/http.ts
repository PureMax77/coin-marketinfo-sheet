import { NextRequest } from "next/server";

export async function http<T>(request: NextRequest): Promise<T> {
  const response = await fetch(request, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  return data;
}
