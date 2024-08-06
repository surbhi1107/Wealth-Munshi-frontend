import * as cookie from "cookie";
import UpdateIncome from "@/components/income/UpdateIncome";

export default function CashflowUpdateIncomes(props) {
  return <UpdateIncome isCashFlow={true} incomeId={props.incomeId} />;
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
  if (!ctx?.query?.incomeId) {
    return {
      redirect: {
        destination: "/resources/incomes",
        permanent: false,
      },
    };
  }
  let incomeId = ctx?.query?.incomeId;
  return { props: { incomeId, user } };
};
