/**
 * @swagger
 * /api/hello:
 *   get:
 *     summary: Hello API
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET() {
  return new Response("hello");
}
