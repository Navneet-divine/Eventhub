"use client";

import type React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Dropdown from "@/app/(root)/events/components/Dropdown";

const schema = z.object({
  category: z.string().optional(),
});

type CategoryFormProps = {
  onCategoryChange: (category: string) => void;
};

const CategoryForm: React.FC<CategoryFormProps> = ({ onCategoryChange }) => {
  const form = useForm({
    resolver: zodResolver(schema),
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
                <div className="relative">
                  <Dropdown
                    hideAllCategory={true}
                    onChangeHandler={(value) => {
                      field.onChange(value);
                      onCategoryChange(value);
                    }}
                    value={field.value}
                    hideAddCategory={true}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </Form>
    </div>
  );
};

export default CategoryForm;
