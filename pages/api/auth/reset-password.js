export default async function handler(req, res) {
  let body = req.body;
  let id = body?.id;
  let token = body?.token;
  let response = await fetch(
    `${process.env.NEXT_AUTH_API_END_POINT}/user/forgot-password-reset/${id}/${token}`,
    {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newpassword: body.password,
      }),
    }
  );
  let res1 = await response.json();
  console.log("---", res1);
  return res.status(200).json({ ...res1 });
}
