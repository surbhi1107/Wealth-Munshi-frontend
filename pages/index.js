import Cookies from "js-cookie";

export default function Home() {
  return (
    <main
      className={`flex w-full min-h-screen flex-col items-center justify-between px-12 md:px-24 lg:px-[130px] bg-white`}
    >
      <div className="w-full">
        <div className="bg-[#F4F3FF] px-10 md:px-14 lg:px-[65px] py-6 md:py-9 rounded-md mt-2">
          <h1>Welcome user,</h1>
        </div>
      </div>
    </main>
  );
}

export function getServerSideProps(ctx) {
  const token = Cookies.get("access-token");
  // if (token === undefined) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/login",
  //     },
  //   };
  // }
  return {
    props: {},
  };
}
