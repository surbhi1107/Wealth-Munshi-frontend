export default async function handler(req, res) {
  try {
    let token = req.cookies?.["access-token"];
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_API_END_POINT}/saving/get-all-savings`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    let res1 = await response.json();
    return res.status(200).json({ ...res1 });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "something wrong" });
  }
}
