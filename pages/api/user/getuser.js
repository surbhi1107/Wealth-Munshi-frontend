export default async function (req, res) {
  let res1 = fetch("http://localhost:4001/user/user-details", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "vasoyasurbhi@gmail.com",
      password: "Munshi@12345",
    }),
  })
    .then((rrr) => rrr.json())
    .then((resss) => {
      res.status(200).json({ resss });
      return resss;
    });
}
