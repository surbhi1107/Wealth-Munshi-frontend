import React, { Fragment, useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { ToastContainer } from "react-toastify";
import * as cookie from "cookie";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Loading from "@/components/Loading";

const Questions = (props) => {
  let partnerId = props?.partnerId;
  const [questionnaire, setQuestionnaire] = useState({});
  const [loading, setLoading] = useState(false);
  let ignore = false;
  const [currentType, setCurrentType] = useState(1);
  const [totalType, setTotalType] = useState(0);
  const [queWithAns, setQueWithAns] = useState([]);
  const [quesData, setQuesData] = useState({});
  const [isTouched, setIsTouched] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const groupBy = (arr, key) => {
    return arr.reduce((result, currentValue) => {
      // Get the value of the key to group by
      const groupKey = currentValue[key];

      // If the group key does not exist, create it and initialize it with an empty array
      if (!result[groupKey]) {
        result[groupKey] = [];
      }

      // Add the current object to the group
      result[groupKey].push(currentValue);

      return result;
    }, {}); // Initial value is an empty object
  };

  const getData = async () => {
    setLoading(true);
    let response = await fetch(`/api/risk-profile/get-partner-questionaries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        partnerId: partnerId,
      }),
    });
    let res1 = await response.json();
    if (res1?.success) {
      setLoading(false);
      setQuesData(res1?.data?.questionaries);
      let dummyques = res1?.data?.questionaries?.questions ?? [];
      const groupedByAge = groupBy(dummyques, "type");
      setTotalType(Object.keys(groupedByAge).length);
      setCurrentType(1);
      setQueWithAns(res1?.data?.questionaries?.questions);
      setQuestionnaire(groupedByAge);
    } else {
      setLoading(false);
      setQuestionnaire({});
    }
  };
  const updateData = async () => {
    let dummyary = [...queWithAns];
    let obtanied = dummyary?.filter((v) => v.answer === v.selected);
    setLoading(true);
    let response = await fetch(`/api/risk-profile/update-questionaries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        partnerId: partnerId,
        details: {
          questions: [...queWithAns],
          for: quesData?.for,
          is_ans_given: true,
          name: quesData.name,
          score: obtanied?.length,
          total: queWithAns?.length,
        },
      }),
    });
    let res1 = await response.json();
    if (res1?.success) {
      setLoading(false);
      getData();
      setCurrentTab(1);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ignore) {
      getData();
    }
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Layout>
      <ToastContainer />
      <div className={`w-full space-y-6`}>
        {/* Partner Details */}
        <div className="w-full px-[30px] py-[30px] bg-white rounded-md space-y-6">
          <TabGroup
            defaultIndex={currentTab}
            onChange={(currentTab) => {
              setCurrentTab(currentTab);
            }}
          >
            <TabList className={"space-x-5 border-b border-[#EDEDED]"}>
              <Tab
                as={Fragment}
                className="focus:outline-none data-[focus]:outline-none"
              >
                {({ hover, selected }) => (
                  <button
                    className={`${
                      selected ? "text-[#57BA52]" : "text-[#45486A]"
                    }`}
                  >
                    Questions
                    <div
                      className={`mt-2 border-2 ${
                        selected
                          ? "border-[#57BA52] rounded-tl-[5px] rounded-tr-[5px] text-[#57BA52]"
                          : "border-transparent"
                      }`}
                    ></div>
                  </button>
                )}
              </Tab>
              <Tab
                as={Fragment}
                className="focus:outline-none data-[focus]:outline-none"
              >
                {({ hover, selected }) => (
                  <button
                    className={`${
                      selected ? "text-[#57BA52]" : "text-[#45486A]"
                    }`}
                  >
                    Results
                    <div
                      className={`mt-2 border-2 ${
                        selected
                          ? "border-[#57BA52] rounded-tl-[5px] rounded-tr-[5px] text-[#57BA52]"
                          : "border-transparent"
                      }`}
                    ></div>
                  </button>
                )}
              </Tab>
            </TabList>
            <TabPanels className="py-5">
              <TabPanel>
                {loading ? (
                  <div className="w-full flex justify-center items-center">
                    <Loading />
                  </div>
                ) : (
                  <div className="h-full grid md:grid-cols-3 md:space-x-5">
                    <div className="hidden md:block border border-[#EDEDED] rounded-md">
                      {Object.keys(questionnaire).map((que_type, i) => (
                        <div key={i} className="w-full">
                          <p className="bg-[#F5F5F58C] text-[#45486A] font-medium px-5 py-2.5">
                            {que_type}
                          </p>
                          {questionnaire[que_type].map((v, ind) => (
                            <p
                              key={ind}
                              onClick={() => {
                                const keys = Object.keys(questionnaire);
                                const index = keys.indexOf(que_type);
                                setCurrentType(index + 1);
                              }}
                              className="text-[#54577A] text-sm cursor-pointer px-5 py-2.5 truncate border-b border-b-[#EDEDED]"
                            >
                              {v.question}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="h-full col-span-2 border border-[#EDEDED] rounded-md pb-5">
                      {Object.keys(questionnaire)
                        .slice(currentType - 1, currentType)
                        .map((title, i) => (
                          <div key={i}>
                            <p className="bg-[#F5F5F58C] text-[#45486A] font-medium px-5 py-2.5">
                              {title}
                            </p>
                            <div className="px-5 py-2.5 space-y-2">
                              {questionnaire[title].map((v, ind) => (
                                <div key={ind} className="py-2 space-y-2">
                                  <p className="text-[#54577A] text-base">
                                    {v.question}
                                  </p>
                                  {/* {isTouched &&
                                  queWithAns?.find((d) => d._id === v?._id)
                                    ?.selected === null ? (
                                    <p className="text-red-600 leading-4">
                                      Please enter a multi choice answer
                                    </p>
                                  ) : (
                                    <></>
                                  )} */}
                                  {/* render option a */}
                                  <div className="flex gap-2 items-center">
                                    <div
                                      onClick={() => {
                                        let dummyary = [...queWithAns];
                                        const updatedary = dummyary.map(
                                          (data) => {
                                            if (data._id === v._id) {
                                              return {
                                                ...data,
                                                selected: "a",
                                              }; // Replace edition with a new value
                                            }
                                            return data;
                                          }
                                        );
                                        const groupedByAge = groupBy(
                                          updatedary,
                                          "type"
                                        );
                                        setQueWithAns(updatedary);
                                        setQuestionnaire(groupedByAge);
                                      }}
                                      className="relative flex items-center rounded-full cursor-pointer"
                                    >
                                      <div
                                        className={`before:content[''] peer relative -gray h-4 w-4 cursor-pointer appearance-none rounded-full border before:absolute before:top-2/4 before:left-2/4 before:block before:h-[17px] before:w-[17px] before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#57BA52] before:opacity-0 before:transition-opacity ${
                                          queWithAns?.find(
                                            (d) => d._id === v?._id
                                          )?.selected === "a"
                                            ? "border-[#57BA52]"
                                            : "border-[#757575]"
                                        } `}
                                      >
                                        <span
                                          className={`absolute text-[#57BA52] transition-opacity pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 ${
                                            queWithAns?.find(
                                              (d) => d._id === v?._id
                                            )?.selected === "a"
                                              ? "opacity-100"
                                              : "opacity-0"
                                          }`}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-2.5 w-2.5"
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                          >
                                            <circle
                                              data-name="ellipse"
                                              cx="8"
                                              cy="8"
                                              r="8"
                                            ></circle>
                                          </svg>
                                        </span>
                                      </div>
                                    </div>
                                    <label className="text-[#A1A1AA] text-sm">
                                      {v.option_a}
                                    </label>
                                  </div>
                                  {/* option b */}
                                  <div className="flex gap-2 items-center">
                                    <div
                                      onClick={() => {
                                        let dummyary = [...queWithAns];
                                        const updatedary = dummyary.map(
                                          (data) => {
                                            if (data._id === v._id) {
                                              return {
                                                ...data,
                                                selected: "b",
                                              }; // Replace edition with a new value
                                            }
                                            return data;
                                          }
                                        );
                                        const groupedByAge = groupBy(
                                          updatedary,
                                          "type"
                                        );
                                        setQueWithAns(updatedary);
                                        setQuestionnaire(groupedByAge);
                                      }}
                                      className="relative flex items-center rounded-full cursor-pointer"
                                    >
                                      <div
                                        className={`before:content[''] peer relative -gray h-4 w-4 cursor-pointer appearance-none rounded-full border before:absolute before:top-2/4 before:left-2/4 before:block before:h-[17px] before:w-[17px] before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#57BA52] before:opacity-0 before:transition-opacity ${
                                          queWithAns?.find(
                                            (d) => d._id === v?._id
                                          )?.selected === "b"
                                            ? "border-[#57BA52]"
                                            : "border-[#757575]"
                                        } `}
                                      >
                                        <span
                                          className={`absolute text-[#57BA52] transition-opacity pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 ${
                                            queWithAns?.find(
                                              (d) => d._id === v?._id
                                            )?.selected === "b"
                                              ? "opacity-100"
                                              : "opacity-0"
                                          }`}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-2.5 w-2.5"
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                          >
                                            <circle
                                              data-name="ellipse"
                                              cx="8"
                                              cy="8"
                                              r="8"
                                            ></circle>
                                          </svg>
                                        </span>
                                      </div>
                                    </div>
                                    <label
                                      className="text-[#A1A1AA] text-sm"
                                      htmlFor={v.option_b}
                                    >
                                      {v.option_b}
                                    </label>
                                  </div>
                                  {/* option c */}
                                  <div className="flex gap-2 items-center">
                                    <div
                                      onClick={() => {
                                        let dummyary = [...queWithAns];
                                        const updatedary = dummyary.map(
                                          (data) => {
                                            if (data._id === v._id) {
                                              return {
                                                ...data,
                                                selected: "c",
                                              }; // Replace edition with a new value
                                            }
                                            return data;
                                          }
                                        );
                                        const groupedByAge = groupBy(
                                          updatedary,
                                          "type"
                                        );
                                        setQueWithAns(updatedary);
                                        setQuestionnaire(groupedByAge);
                                      }}
                                      className="relative flex items-center rounded-full cursor-pointer"
                                    >
                                      <div
                                        className={`before:content[''] peer relative -gray h-4 w-4 cursor-pointer appearance-none rounded-full border before:absolute before:top-2/4 before:left-2/4 before:block before:h-[17px] before:w-[17px] before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#57BA52] before:opacity-0 before:transition-opacity ${
                                          queWithAns?.find(
                                            (d) => d._id === v?._id
                                          )?.selected === "c"
                                            ? "border-[#57BA52]"
                                            : "border-[#757575]"
                                        } `}
                                      >
                                        <span
                                          className={`absolute text-[#57BA52] transition-opacity pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 ${
                                            queWithAns?.find(
                                              (d) => d._id === v?._id
                                            )?.selected === "c"
                                              ? "opacity-100"
                                              : "opacity-0"
                                          }`}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-2.5 w-2.5"
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                          >
                                            <circle
                                              data-name="ellipse"
                                              cx="8"
                                              cy="8"
                                              r="8"
                                            ></circle>
                                          </svg>
                                        </span>
                                      </div>
                                    </div>
                                    <label
                                      className="text-[#A1A1AA] text-sm"
                                      htmlFor={v.option_c}
                                    >
                                      {v.option_c}
                                    </label>
                                  </div>
                                  {/* option d */}
                                  <div className="flex gap-2 items-center">
                                    <div
                                      onClick={() => {
                                        let dummyary = [...queWithAns];
                                        const updatedary = dummyary.map(
                                          (data) => {
                                            if (data._id === v._id) {
                                              return {
                                                ...data,
                                                selected: "d",
                                              }; // Replace edition with a new value
                                            }
                                            return data;
                                          }
                                        );
                                        const groupedByAge = groupBy(
                                          updatedary,
                                          "type"
                                        );
                                        setQueWithAns(updatedary);
                                        setQuestionnaire(groupedByAge);
                                      }}
                                      className="relative flex items-center rounded-full cursor-pointer"
                                    >
                                      <div
                                        className={`before:content[''] peer relative -gray h-4 w-4 cursor-pointer appearance-none rounded-full border before:absolute before:top-2/4 before:left-2/4 before:block before:h-[17px] before:w-[17px] before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#57BA52] before:opacity-0 before:transition-opacity ${
                                          queWithAns?.find(
                                            (d) => d._id === v?._id
                                          )?.selected === "d"
                                            ? "border-[#57BA52]"
                                            : "border-[#757575]"
                                        } `}
                                      >
                                        <span
                                          className={`absolute text-[#57BA52] transition-opacity pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 ${
                                            queWithAns?.find(
                                              (d) => d._id === v?._id
                                            )?.selected === "d"
                                              ? "opacity-100"
                                              : "opacity-0"
                                          }`}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-2.5 w-2.5"
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                          >
                                            <circle
                                              data-name="ellipse"
                                              cx="8"
                                              cy="8"
                                              r="8"
                                            ></circle>
                                          </svg>
                                        </span>
                                      </div>
                                    </div>
                                    <label
                                      className="text-[#A1A1AA] text-sm"
                                      htmlFor={v.option_d}
                                    >
                                      {v.option_d}
                                    </label>
                                  </div>
                                  {/* option e */}
                                  <div className="flex gap-2 items-center">
                                    <div
                                      onClick={() => {
                                        let dummyary = [...queWithAns];
                                        const updatedary = dummyary.map(
                                          (data) => {
                                            if (data._id === v._id) {
                                              return {
                                                ...data,
                                                selected: "e",
                                              }; // Replace edition with a new value
                                            }
                                            return data;
                                          }
                                        );
                                        const groupedByAge = groupBy(
                                          updatedary,
                                          "type"
                                        );
                                        setQueWithAns(updatedary);
                                        setQuestionnaire(groupedByAge);
                                      }}
                                      className="relative flex items-center rounded-full cursor-pointer"
                                    >
                                      <div
                                        className={`before:content[''] peer relative -gray h-4 w-4 cursor-pointer appearance-none rounded-full border before:absolute before:top-2/4 before:left-2/4 before:block before:h-[17px] before:w-[17px] before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#57BA52] before:opacity-0 before:transition-opacity ${
                                          queWithAns?.find(
                                            (d) => d._id === v?._id
                                          )?.selected === "e"
                                            ? "border-[#57BA52]"
                                            : "border-[#757575]"
                                        } `}
                                      >
                                        <span
                                          className={`absolute text-[#57BA52] transition-opacity pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 ${
                                            queWithAns?.find(
                                              (d) => d._id === v?._id
                                            )?.selected === "e"
                                              ? "opacity-100"
                                              : "opacity-0"
                                          }`}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-2.5 w-2.5"
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                          >
                                            <circle
                                              data-name="ellipse"
                                              cx="8"
                                              cy="8"
                                              r="8"
                                            ></circle>
                                          </svg>
                                        </span>
                                      </div>
                                    </div>
                                    <label
                                      className="text-[#A1A1AA] text-sm"
                                      htmlFor={v.option_e}
                                    >
                                      {v.option_e}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      {quesData?.is_ans_given ? (
                        <></>
                      ) : (
                        <div className="flex justify-between items-center px-5">
                          <button
                            disabled={currentType === 1 ? true : false}
                            onClick={() => {
                              setCurrentType(currentType - 1);
                              setIsTouched(true);
                            }}
                            className="border border-[#999999] hover:border-[#57BA52] rounded py-2 bg-transparent px-5 font-medium capitalize text-[#999999] hover:text-[#57BA52] disabled:opacity-80 disabled:hover:border-[#999999] disabled:hover:text-[#999999]"
                          >
                            Previous
                          </button>
                          {currentType === totalType ? (
                            <button
                              onClick={() => {
                                updateData();
                              }}
                              className="border border-[#999999] hover:border-[#57BA52] rounded py-2 bg-transparent px-5 font-medium capitalize text-[#999999] hover:text-[#57BA52]"
                            >
                              Submit
                            </button>
                          ) : (
                            <button
                              disabled={
                                currentType === totalType ? true : false
                              }
                              onClick={() => {
                                setIsTouched(true);
                                setCurrentType(currentType + 1);
                              }}
                              className="border border-[#999999] hover:border-[#57BA52] rounded py-2 bg-transparent px-5 font-medium capitalize text-[#999999] hover:text-[#57BA52]"
                            >
                              Next
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabPanel>
              <TabPanel>
                {loading ? (
                  <div className="w-full flex justify-center items-center">
                    <Loading />
                  </div>
                ) : (
                  <>
                    {quesData?.is_ans_given ? (
                      <div className="space-y-3">
                        <p className="text-[20px] md:text-2xl font-medium text-[#45486A]">
                          Your risk profile has been set to Aggressive.
                        </p>
                        <div className="w-full md:w-8/12 lg:w-6/12 !mt-10 !mb-5">
                          <div className="">
                            <div className="w-full h-[10px] relative bg-[#E3FFE2] rounded-2xl">
                              <div
                                style={{
                                  width: `${
                                    (quesData?.score / quesData?.total) * 100
                                  }%`,
                                }}
                                className="absolute top-0 left-0 bg-[#57BA52] rounded-2xl h-full"
                              >
                                <span className="bg-[#57BA52] text-white rounded-md font-semibold text-xs py-1 px-2 absolute -right-4 bottom-full mb-2">
                                  <span className="w-2 h-2 rotate-45 bg-[#57BA52] absolute z-10 bottom-[-4px] left-1/2 -translate-x-1/2 rounded-sm"></span>
                                  {`${(
                                    (quesData?.score / quesData?.total) *
                                    100
                                  )?.toFixed(0)}%`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-[#45486A]">
                          An Aggressive profile means that you will be
                          comfortable with accepting some risk in the
                          arrangements for your finances. In particular you will
                          be comfortable with including relatively higher risk
                          higher return investments in your portfolio.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-[20px] md:text-2xl font-medium text-[#45486A]">
                          Result Unavailable
                        </p>
                        <p className="text-[#45486A]">
                          You have not yet completed the questionnaire. Please
                          return and answer all the questions.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </Layout>
  );
};

export default Questions;

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
  if (!ctx?.query?.partnerId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { user, ...ctx?.query } };
};
