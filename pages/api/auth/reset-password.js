export default async function handler(req, res) {
  try {
    let body = req.body;
    let id = body?.id;
    let token = body?.token;
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_API_END_POINT}/user/forgot-password-reset/${id}/${token}`,
      {
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
    return res.status(200).json({ ...res1 });
  } catch (error) {
    console.log(error);
    return res.status(500).send("something wrong");
  }
}
