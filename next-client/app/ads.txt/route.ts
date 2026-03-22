const ADS_TXT = 'google.com, pub-1997736983474353, DIRECT, f08c47fec0942fa0';

export function GET() {
  return new Response(`${ADS_TXT}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}
