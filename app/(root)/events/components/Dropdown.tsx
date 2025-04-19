"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory, getCategories } from "@/lib/actions/category.actions";

type Category = {
  name: string;
  _id: string;
};

type DropdownProps = {
  value?: string;
  onChangeHandler?: (value: string) => void;
};

const Dropdown: React.FC<DropdownProps> = ({ onChangeHandler, value }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");

  async function handleAddNewCategory() {
    try {
      const res = await createCategory(newCategory);
      if ("error" in res) {
        setError(res.error);
      } else {
        setError("");
        setNewCategory("");
        const updatedCategories = await getCategories();
        setCategories(updatedCategories);
      }
    } catch (error: any) {
      console.log(error.message);
      setError("Something went wrong while creating the category");
    }
  }

  useEffect(() => {
    async function getAllCategories() {
      const allCategories = await getCategories();
      console.log(allCategories);
      setCategories(allCategories);
    }
    getAllCategories();
  }, []);

  return (
    <div>
      <Select onValueChange={onChangeHandler} defaultValue={value}>
        <SelectTrigger className="w-full border-none">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            {categories.map((category, i) => (
              <SelectItem key={i} value={category.name}>
                {category.name}
              </SelectItem>
            ))}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-violet-600 border-none w-fit cursor-pointer hover:text-violet-600 px-2"
                >
                  Add new category
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>New Category</AlertDialogTitle>
                  <AlertDialogDescription>
                    <Input
                      type="text"
                      placeholder="Category name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                    {error && (
                      <span className="text-red-500 text-sm mt-2">{error}</span>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-violet-600 hover:bg-violet-600"
                    onClick={handleAddNewCategory}
                  >
                    ADD
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Dropdown;
