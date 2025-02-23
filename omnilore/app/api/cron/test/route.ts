export async function GET() {
  // wait 20 secs then respond
  await new Promise(resolve => setTimeout(resolve, 20000));
  return Response.json({ message: "Hello, world!" });
}
