"use client";
import React, { useEffect, useState } from "react";
import useWatchlistsDataStore from "../zustand/useWatchlistDataStore";
import axios from "axios";
import Modal from "./Modal"; // Ensure the correct import path

const SideBar = () => {
  const [activeTab, setActiveTab] = useState("watchlists");
  const [activeWatchlist, setActiveWatchlist] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [newStock, setNewStock] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);

  const { watchlists, updateWatchlists } = useWatchlistsDataStore();

  function handleTabClick(tab) {
    setActiveTab(tab);
    setActiveWatchlist(null);
  }

  function handleWatchlistClick(watchlist) {
    setActiveTab("watchlist");
    setActiveWatchlist(watchlist);
  }

  async function handleAddWatchlist(watchlistTitleText) {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlist/add`, {
        title: watchlistTitleText,
      });
      setDataChanged((prev) => !prev);
    } catch (err) {
      console.log("Error in adding watchlist. ", err.message);
    }
  }

  async function handleDeleteWatchlist(title) {
    console.log("title", title);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlist/delete?title=${title}`
      );
      setDataChanged((prev) => !prev);
    } catch (err) {
      console.log("Error in deleting watchlist. ", err.message);
    }
  }

  async function handleAddStock() {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlist/addStock`,
        {
          watchlist: activeWatchlist.title,
          stock: newStock,
        }
      );
      setNewStock("");
      setSuggestions([]);
      setDataChanged((prev) => !prev);
    } catch (err) {
      console.log("Error in adding stock to watchlist. ", err.message);
    }
  }

  async function handleDeleteStock(title, stock) {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlist/deleteStock?title=${title}&stock=${stock}`
      );
      setDataChanged((prev) => !prev);
    } catch (err) {
      console.log("Error in deleting stock from watchlist. ", err.message);
    }
  }

  async function searchStocks(e) {
    const stockToBeSearched = e.target.value;
    setNewStock(stockToBeSearched);
    if (stockToBeSearched.length > 2) {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_OS_BE_URI}/search`,
          {
            params: { searchQuery: stockToBeSearched },
          }
        );
        const stocks = res.data.map((stock) => stock._source.name);
        setSuggestions(stocks);
      } catch (err) {
        console.log("Error in searching: ", err.message);
      }
    } else {
      setSuggestions([]);
    }
  }

  useEffect(() => {
    async function getWatchlists() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlist/get`
        );
        updateWatchlists(res.data);
        if (res.data.length !== 0) {
          setActiveTab("watchlist");
          setActiveWatchlist(res.data[0]);
        }
      } catch (err) {
        console.log("Error in getting watchlists: ", err.message);
      }
    }
    getWatchlists();
  }, [dataChanged]);

  return (
    <div className="flex flex-col bg-gray-200 h-screen border-r border-gray-300">
      <div className="p-2">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">Watchlists</h1>
          <button
            className={`text-blue-500 hover:text-blue-700 p-2 ${
              isModalOpen ? "hidden" : ""
            }`}
            onClick={() => setIsModalOpen(true)}
          >
            +
          </button>
          {isModalOpen && (
            <Modal
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleAddWatchlist}
            />
          )}
        </div>
        <div>
          <ul className="flex overflow-x-auto">
            {watchlists.map((watchlist, index) => (
              <li
                key={index}
                className={`cursor-pointer flex items-center mr-2 p-2 ${
                  activeTab === "watchlist" && activeWatchlist === watchlist
                    ? "font-semibold bg-white"
                    : ""
                }`}
                onClick={() => handleWatchlistClick(watchlist)}
              >
                <span>{watchlist.title}</span>
                <button
                  className="p-2 text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteWatchlist(watchlist.title)}
                >
                  &#10005;
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {activeTab === "watchlist" && (
        <div className="p-4 bg-white h-full">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold">{activeWatchlist.title}</h1>
            <div className="flex items-center relative">
              <input
                type="text"
                className="border border-gray-400 mr-2 p-1 ml-2 w-3/4"
                placeholder="New Stock"
                value={newStock}
                onChange={searchStocks}
              />
              {suggestions.length > 0 && (
                <ul className="absolute left-0 top-8 border border-gray-400 bg-white z-10 w-48">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setNewStock(suggestion);
                        setSuggestions([]);
                      }}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={handleAddStock}
              >
                +
              </button>
            </div>
          </div>
          <div>
            <ul>
              {activeWatchlist.stocks.map((stock, index) => (
                <li key={index}>
                  {stock}
                  <button
                    className="p-2 text-red-500 hover:text-red-700"
                    onClick={() =>
                      handleDeleteStock(activeWatchlist.title, stock)
                    }
                  >
                    &#10005;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
