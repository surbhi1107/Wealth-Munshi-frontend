export default async function handler(req, res) {
  let token = req.cookies?.["access-token"];
  let response = await fetch(
    `${process.env.NEXT_PUBLIC_API_END_POINT}/partner/get-all-partners`,
    {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    }
  );
  let res1 = await response.json();
  return res.status(200).json({ ...res1 });
}
