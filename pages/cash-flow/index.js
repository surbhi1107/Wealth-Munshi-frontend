import * as cookie from "cookie";
import GetIncome from "@/components/income/GetIncome";

export default function Incomes() {
  return <GetIncome isCashFlow={true} />;
}

export const getServerSideProps = async (ctx) => {
  let newcookies = ctx.req.headers.cookie;
  newcookies = cookie.parse(newcookies);
  let user = JSON.parse(newcookies?.user ?? "");
  if (user?.dob === undefined || user?.dob?.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { user } };
};
