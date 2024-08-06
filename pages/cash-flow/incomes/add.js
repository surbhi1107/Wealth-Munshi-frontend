import * as cookie from "cookie";
import AddIncome from "@/components/income/AddIncome";

export default function CashflowAddincome(props) {
  return <AddIncome isCashFlow={true} income_type={props.income_type?.value} />;
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
  if (!ctx?.query?.income_type) {
    return {
      redirect: {
        destination: "/resources/incomes",
        permanent: false,
      },
    };
  }
  let income_type =
    ctx?.query?.income_type === undefined
      ? ""
      : JSON.parse(ctx?.query?.income_type);
  return { props: { income_type, user } };
};
