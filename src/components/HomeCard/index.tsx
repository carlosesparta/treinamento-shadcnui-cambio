"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function HomeCard() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [fromValue, setFromValue] = useState("");
  const [toCurrency, setToCurrency] = useState("BRL");
  const [toValue, setToValue] = useState("");
  const [exchangeRate, setExchangeRate] = useState(0);

  const handleFromCurrencyChange = (value: string) => {
    setFromCurrency(value);
  };
  const handleFromValueChange = (e) => {
    setFromValue(maskCurrency(e.target.value));
    setToValue(maskCurrency(convertCurrency(e.target.value)));
  };
  const handleToCurrencyChange = (value: string) => {
    setToCurrency(value);
  };
  const handleToValueChange = (e) => {
    setToValue(maskCurrency(e.target.value));
    setFromValue(maskCurrency(convertCurrency(e.target.value)));
  };

  const maskCurrency = (value: string) => {
    let number = value.replace(/\D/g, "");
    number = number.replace(/(\d)(\d{2})$/, "$1,$2");
    number = number.replace(/(?=(\d{3})+(\D))\B/g, ".");
    return number;
  };

  const getCurrencyValue = async () => {
    const result = await fetch(
      `https://v6.exchangerate-api.com/v6/{YOURAPIKEY}/latest/${fromCurrency}`
    );
    const data = await result.json();
    const rate = data.conversion_rates[toCurrency];
    setExchangeRate(rate.toFixed(2));
  };

  const convertCurrency = (value: string) => {
    const number = value.replace(/\D/g, "");
    return ((parseFloat(number) / 100) * exchangeRate).toFixed(2);
  };

  useEffect(() => {
    getCurrencyValue();
  }, [fromCurrency, toCurrency]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Cambio Hoje</h1>
      <div className="flex gap-2 mb-4">
        <Select
          defaultValue={fromCurrency}
          onValueChange={(value) => handleFromCurrencyChange(value)}
          value={fromCurrency}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="usd" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Moeda</SelectLabel>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="BRL">BRL</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          placeholder="Valor"
          value={fromValue}
          onChange={(e) => handleFromValueChange(e)}
        />
      </div>
      <div className="flex gap-2">
        <Select
          defaultValue={toCurrency}
          onValueChange={(value) => handleToCurrencyChange(value)}
          value={toCurrency}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="usd" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Moeda</SelectLabel>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="BRL">BRL</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          placeholder="Valor"
          value={toValue}
          onChange={(e) => handleToValueChange(e)}
          disabled
        />
      </div>
    </div>
  );
}
