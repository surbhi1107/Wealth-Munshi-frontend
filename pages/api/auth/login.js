import Cookies from "js-cookie";

export default async function handler(req, res) {
  let response = await fetch("http://localhost:4001/user/login", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "vasoyasurbhi@gmail.com",
      password: "Munshi@12345",
    }),
  });
  let res1 = await response.json();
  return res.status(200).json({ ...res1 });
}
