export default async function handler(req, res) {
  try {
    let body = req.body;
    let response = await fetch(
      `${process.env.NEXT_AUTH_API_END_POINT}/user/login`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    let res1 = await response.json();
    return res.status(200).json({ ...res1 });
  } catch (error) {
    console.log(error);
    return res.status(500).send("something wrong");
  }
}
