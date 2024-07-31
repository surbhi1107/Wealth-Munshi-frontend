export default async function handler(req, res) {
  try {
    let token = req.cookies?.["access-token"];
    let body = req.body;
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_API_END_POINT}/risk-profile/get-partner-questionaries`,
      {
        method: "POST",
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
    return res.status(500).send("something wrong");
  }
}
