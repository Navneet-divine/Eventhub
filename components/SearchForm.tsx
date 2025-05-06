"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import searchIcon from "@/public/icons/search.svg";

const formSchema = z.object({
  title: z.string().optional(),
});

const SearchForm: React.FC<{ onSearch: (query: string) => void }> = ({
  onSearch,
}) => {
  const [inputValue, setInputValue] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  // Handle debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, onSearch]);

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Image
                    src={searchIcon || "/placeholder.svg"}
                    alt="Search"
                    width={20}
                    height={20}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  />
                  <Input
                    placeholder="Search event..."
                    className="pl-12 shadow-none"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      setInputValue(e.target.value);
                    }}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default SearchForm;
