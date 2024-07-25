import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className={`w-full h-full bg-[#F5FAF5] p-5`}>
        <div className="w-full px-5 py-4 bg-white rounded-md">
          <div className="w-full flex justify-between">
            <h1 className="text-[26px] font-semibold text-[#45486A]">
              Client Household
            </h1>
            <button className="border border-[#57BA52] rounded-lg py-2 bg-transparent px-8 font-medium text-[#57BA52]">
              Add Partner
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
