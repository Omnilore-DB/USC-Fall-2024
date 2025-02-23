export async function GET() {
  // wait 20 secs then respond
  console.log("Waiting for 20 seconds...");
  await new Promise(resolve => setTimeout(resolve, 16000));
  console.log("Done");
  return Response.json({ message: "Hello, world!" });
}
