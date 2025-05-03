"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import searchIcon from "@/public/icons/search.svg";

const formSchema = z.object({
  title: z.string().min(1, "title is required"),
});

const SearchForm: React.FC<{ onSearch: (query: string) => void }> = ({
  onSearch,
}) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchQuery);
    }, 200);

    return () => clearTimeout(handler);
  }, [searchQuery, onSearch]);

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Image
                    src={searchIcon}
                    alt="Search"
                    width={20}
                    height={20}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  />
                  <Input
                    placeholder="Search event..."
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setSearchQuery(e.target.value);
                    }}
                    className="pl-12 shadow-none"
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
