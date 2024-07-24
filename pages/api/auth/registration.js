import Cookies from "js-cookie";

export default async function handler(req, res) {
  let body = req.body;
  let response = await fetch("http://localhost:4001/user/register", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  let res1 = await response.json();
  return res.status(200).json({ ...res1 });
}
