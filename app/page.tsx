"use client";

import axios from "axios";
import { Montserrat } from "next/font/google";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const API_KEY = "4828c422f2-b257572eb7-ry1pb0";
const BASE_URL = "https://api.fastforex.io/fetch-one";
const CURRENCIES = ["EUR", "USD", "CZK"];

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const MainPage = () => {
  type Callback = (...args: any[]) => void;
  type Currency = "EUR" | "USD" | "CZE";

  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [convertFromCurrency, setConvertFromCurrency] =
    useState<Currency>("EUR");
  const [convertToCurrency, setConvertToCurrency] = useState<Currency>("USD");

  const [conversionData, setConversionData] = useState<
    {
      before: string;
      after: string;
      fromCurrency: string;
      toCurrency: string;
    }[]
  >([]);

  const handleFromCurrencyChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setConvertFromCurrency(e.target.value as Currency);
  };

  const handleToCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConvertToCurrency(e.target.value as Currency);
  };

  const handleConversion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const conversion = {
      before: amount,
      after: convertedAmount,
      fromCurrency: convertFromCurrency,
      toCurrency: convertToCurrency,
    };
    setConversionData((prevData) => [...prevData, conversion]);

    toast.success("Conversion successful!");

    setAmount("");
  };

  const debounce = <T extends Callback>(callback: T, delay: number) => {
    let timerId: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };

  useEffect(() => {
    const fetchCurrentRates = async () => {
      const res = await axios.get(
        `${BASE_URL}?from=${convertFromCurrency.toUpperCase()}&to=${convertToCurrency.toUpperCase()}&api_key=${API_KEY}`
      );

      setConvertedAmount(
        (Number(amount) * res.data.result[convertToCurrency]).toFixed(2)
      );
    };

    const debouncedFetchCurrentRates = debounce(fetchCurrentRates, 500);

    if (amount) {
      debouncedFetchCurrentRates();
    }
  }, [amount, convertFromCurrency, convertToCurrency]);

  return (
    <div className="h-full w-full flex justify-center bg-gray-700">
      <div className="w-full max-w-4xl">
        <h1 className={`text-7xl text-center mt-24 ${montserrat.className}`}>
          Currency Converter
        </h1>
        <div className="flex justify-between w-full mt-32">
          <form
            className="flex flex-col items-center gap-4 w-full"
            onSubmit={handleConversion}
          >
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text text-xl text-white">Amount</span>
              </label>
              <input
                min={0}
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
                type="number"
                placeholder="Amount to be converted.."
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text text-xl text-white">
                  Convert from
                </span>
              </label>
              <select
                className="select select-bordered w-full max-w-xs"
                value={convertFromCurrency}
                onChange={handleFromCurrencyChange}
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency}>{currency}</option>
                ))}
              </select>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text text-xl text-white">
                  Convert to
                </span>
              </label>
              <select
                className="select select-bordered w-full max-w-xs"
                value={convertToCurrency}
                onChange={handleToCurrencyChange}
              >
                {CURRENCIES.filter(
                  (currency) => currency !== convertFromCurrency
                ).map((currency) => (
                  <option key={currency}>{currency}</option>
                ))}
              </select>
            </div>
            {amount && (
              <div className="flex gap-8">
                <button className="btn btn-accent" type="submit">
                  Convert
                </button>
                <div className="flex flex-col">
                  <div className="flex gap-8 italic opacity-30">
                    <p>Before</p>
                    <p>
                      {amount} {convertFromCurrency}
                    </p>
                  </div>
                  <div className="flex gap-8 italic opacity-30">
                    <p>After</p>
                    <p>
                      {convertedAmount} {convertToCurrency}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
          {conversionData.length > 0 && (
            <div className="w-full">
              <h1 className="label-text text-xl text-white">
                Table of Conversions
              </h1>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Before</th>
                      <th>After</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversionData.map((data, idx) => (
                      <tr key={idx}>
                        <th>{idx + 1}</th>
                        <td>
                          {data.before} {data.fromCurrency}
                        </td>
                        <td>
                          {data.after} {data.toCurrency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
