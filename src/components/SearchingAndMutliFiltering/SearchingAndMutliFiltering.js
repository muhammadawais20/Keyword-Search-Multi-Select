"use client";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import Card from "../Card/Card";

import data from "@/app/mock/data";

export default function SearchingAndMutliFiltering() {
  const itemsToLoad = 3;
  const textInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("FREE");
  const [selectedCourseCategories, setSelectedCourseCategories] = useState([]);
  const [suggestionsAreVisible, setSuggestionsVisibility] = useState(false);

  const [visibleItems, setVisibleItems] = useState(3);

  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const filteredCourseData = data?.filter((item) => {
    const coursePriceMatches = item?.coursePrice === activeTab;
    const searchedData = item?.name === searchInput;

    const categoryMatches = selectedCourseCategories.some(
      (obj) => obj.label === item?.courseCategory
    );

    if (searchInput || categoryMatches) {
      return searchedData || categoryMatches;
    }

    if (selectedCourseCategories.length === 0) {
      return coursePriceMatches;
    }

    return coursePriceMatches && categoryMatches;
  });

  const [items, setItems] = useState(filteredCourseData);

  const categories = [...new Set(data?.map((node) => node?.coursePrice))];

  const courseCategories = [
    ...new Set(data?.map((node) => node?.courseCategory)),
  ];

  const loadMore = () => {
    setVisibleItems(visibleItems + itemsToLoad);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setSearchInput("");
    setSelectedCourseCategories([])
    setVisibleItems(3)
  };

  function keywordSearch(data, keyword) {
    return data?.filter((item) =>
      item?.name.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  const handleSearch = (event) => {
    const keyword = event.target.value;
    setSearchInput(keyword);

    setSuggestionsVisibility(true);

    const results = keywordSearch(data, keyword);
    setSearchResults(results);
  };

  const handleResultClick = (hit) => {
    setSearchInput(hit?.name);

    setSearchResults([]);
  };

  const handleClickOutside = (event) => {
    if (textInputRef.current && !textInputRef.current.contains(event.target)) {
      setSuggestionsVisibility(false);
    }
  };

  useEffect(() => {
    setItems(filteredCourseData);
  }, [activeTab, selectedCourseCategories]);

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-[150px] pt-[4.75rem] pb-20">
      <div className="flex flex-col lg:flex-row justify-center mb-10 max-w-[870px] mx-auto">
        <div className="w-full max-w-xs mr-5">
          <div className="relative">
            <form
              noValidate=""
              className="flex w-full max-w-xs pl-[10px] border border-brand-gray-light-2 rounded-lg"
              action=""
              role="search"
            >
              <input
                className="flex-1 h-[40px] text-lg leading-tight bg-transparent outline-none"
                type="search"
                placeholder="Search by Keyword"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                maxLength="512"
                value={searchInput}
                onChange={handleSearch}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    setSuggestionsVisibility(false);
                  }
                }}
              />
              <button
                type="reset"
                title="Clear the search query."
                className="ais-SearchBox-reset"
                hidden
              >
                <span className="sr-only">Reset</span>
                <svg
                  className="ais-SearchBox-resetIcon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  width="10"
                  height="10"
                >
                  <path d="M8.114 10L.944 2.83 0 1.885 1.886 0l.943.943L10 8.113l7.17-7.17.944-.943L20 1.886l-.943.943-7.17 7.17 7.17 7.17.943.944L18.114 20l-.943-.943-7.17-7.17-7.17 7.17-.944.943L0 18.114l.943-.943L8.113 10z" />
                </svg>
              </button>
            </form>
            <ul
              ref={textInputRef}
              className={`w-full absolute z-50 top-10 left-0 bg-white shadow-md overflow-y-scroll max-h-[40rem] ${
                searchResults.length > 0 && suggestionsAreVisible
                  ? ""
                  : "hidden"
              }`}
            >
              {searchResults.map((hit, i) => (
                <li
                  key={i}
                  className="suggestion px-6 py-2"
                  onClick={() => {
                    handleResultClick(hit);
                  }}
                  tabIndex="0"
                >
                  {hit?.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full max-w-xs outline-none">
          <MultiSelect
            className="h-full flex flex-col justify-center text-lg bg-transparent"
            hasSelectAll={false}
            labelledBy="Browse by Category"
            overrideStrings={{
              search: "Browse by Category",
              selectSomeItems: "Browse by Category",
            }}
            options={[
              ...(Array.isArray(courseCategories)
                ? courseCategories?.map((node) => ({
                    value: node,
                    label: node,
                  }))
                : []),
            ]}
            value={selectedCourseCategories}
            onChange={setSelectedCourseCategories}
          />
        </div>
      </div>
      <div className="w-full">
        <div
          className={`flex items-center justify-center gap-4 ${
            !filteredCourseData?.length ? "mb-10" : "mb-[60px]"
          }`}
        >
          {categories?.map((node, i) => {
            return (
              <button
                key={i}
                onClick={() => handleTabClick(node)}
                className={`py-3 px-5 rounded-md font-sans text-[18px] font-semibold leading-normal capitalize  border-[#D3D3D3] ${
                  activeTab === node
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray border"
                }`}
              >
                {node}
              </button>
            );
          })}
        </div>
        {filteredCourseData && (
          <div className="ais-Stats">
            <span className="ais-Stats-text">
              {filteredCourseData?.length || searchResults?.length ? (
                <p className="text-lg">
                  {filteredCourseData?.length || searchResults?.length} Results
                  Found
                </p>
              ) : (
                <p className="text-lg">No match found!</p>
              )}
            </span>
          </div>
        )}
        <div className="grid grid-cols-3 gap-10 mt-7 mb-10">
          {filteredCourseData?.slice(0, visibleItems).map((node, index) => {
            return <Card key={index} {...node} />;
          })}
        </div>
        <div className="flex justify-center">
          {visibleItems < items?.length && (
            <button
              className="py-3 px-5 rounded-md font-sans text-[18px] font-semibold leading-normal capitalize  border-[#D3D3D3] bg-white text-gray border hover:bg-blue-500 hover:text-white"
              onClick={loadMore}
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
