export default async function handler(req, res) {
  let token = req.cookies?.["access-token"];
  let response = await fetch(`http://localhost:4001/user/get-dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  let res1 = await response.json();
  return res.status(200).json({ ...res1 });
}
