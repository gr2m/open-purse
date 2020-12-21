const data = require("@begin/data");
const arc = require("@architect/functions");
const { verify } = require("@octokit/webhooks");

const secret = process.env.WEBHOOK_SECRET;

/**
 * @param {Request} request
 */
exports.handler = async function http(request) {
  const body = Buffer.from(request.body, "base64").toString();
  const signature = request.headers["x-hub-signature-256"];
  // if (!(await verify(secret, body, signature))) {
  //   return {
  //     statusCode: 400,
  //     body: "request body does not match verification signature",
  //   };
  // }

  const payload = arc.http.helpers.bodyParser(request);
  const key = request.headers["x-github-delivery"];

  // naively store everything, for now
  await data.set({ table: "webhooks", key, headers: request.headers, payload });

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
};
