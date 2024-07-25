export default async function handler(req, res) {
  let token = req.cookies?.["access- token"];
  let response = await fetch(
    `${process.env.NEXT_AUTH_API_END_POINT}/user/user-details`,
    {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access-token=${token}`,
      },
    }
  );
  let res1 = await response.json();
  return res.status(200).json({ ...res1 });
}
