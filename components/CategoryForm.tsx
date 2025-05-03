"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Dropdown from "@/app/(root)/events/components/Dropdown";

const CategoryForm: React.FC = () => {
  const form = useForm({
    defaultValues: {
      category: "",
    },
  });

  return (
    <div>
      <Form {...form}>
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Dropdown
                  onChangeHandler={field.onChange}
                  value={field.value}
                  hideAddCategory={true}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </Form>
    </div>
  );
};

export default CategoryForm;
