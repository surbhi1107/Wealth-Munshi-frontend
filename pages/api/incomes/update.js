export default async function handler(req, res) {
  try {
    let body = req.body;
    let token = req.cookies?.["access-token"];
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_API_END_POINT}/income/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ ...body }),
      }
    );
    let res1 = await response.json();
    return res.status(200).json({ ...res1 });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "something wrong", ...error });
  }
}
