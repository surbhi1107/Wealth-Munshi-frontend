
import axios from 'axios';

export default async function handler(req, res) {
  try {
    let body = req.body;
    let response = await axios.post(
      `${process.env.NEXT_AUTH_API_END_POINT}/user/login`,
      body,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let res1 = response.data;
    return res.status(200).json({ res1 });
  } catch (error) {
    console.log(error);
    return res.status(500).send("something wrong");
  }
}

