"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Dropdown from "@/app/(root)/events/components/Dropdown";

const schema = z.object({
  category: z.string().min(1, "Please select a category"),
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
                <Dropdown
                  onChangeHandler={(value) => {
                    field.onChange(value);
                    onCategoryChange(value);
                  }}
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
