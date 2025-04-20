"use client";

import type React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useState, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { evnetFormSchema } from "@/lib/validator";
import { eventDefaultValues } from "@/constants";
import Dropdown from "./Dropdown";
import { CloudUpload } from "lucide-react";

import locationIcon from "@/public/icons/location-grey.svg";
import calenderIcon from "@/public/icons/calendar.svg";
import urlIcon from "@/public/icons/link.svg";
import priceIcon from "@/public/icons/dollar.svg";

import { createEvent } from "@/lib/actions/event.actions";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof evnetFormSchema>;

const EventForm: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const fileUpload = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(evnetFormSchema),
    defaultValues: eventDefaultValues,
  });

  const handleUploadFile = () => {
    fileUpload.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      form.setValue("imageUrl", "image-will-be-uploaded" as any);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      form.setValue("imageUrl", "image-will-be-uploaded" as any);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const onSubmit = async (values: FormData) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key !== "imageUrl" && value !== undefined && value !== null) {
          if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else {
            formData.append(key, String(value));
          }
        }
      });

      if (imageFile) {
        formData.append("imageUrl", imageFile);
      }

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const result = await createEvent(formData, session?.user);
      console.log(result);

      if (result.success === false) {
        console.error("Error creating event:", result.error);
      } else {
        form.reset();
        setImagePreview(null);
        setImageFile(null);
      }
      router.push(`/events/event-detail/${result._id}`);
    } catch (error) {
      console.error("Failed to create event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="md:py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Event title"
                      {...field}
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Dropdown
                      onChangeHandler={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <div className="md:col-span-1">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Description"
                        {...field}
                        className="h-64"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* File Upload */}
            <div className="md:col-span-1">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <div
                      onClick={handleUploadFile}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`relative flex justify-center items-center border-2 ${
                        isDragging
                          ? "border-blue-500 bg-blue-50"
                          : "border-dashed border-gray-300"
                      } rounded-md cursor-pointer h-64 transition-all duration-200`}
                    >
                      {!imagePreview && (
                        <div className="absolute flex flex-col items-center">
                          <CloudUpload
                            className="text-gray-600 mb-3"
                            size={50}
                          />
                          <h1 className="text-gray-500 text-sm font-semibold mb-2">
                            Drag & drop an image here or click to upload
                          </h1>
                          <Button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-500 px-5"
                          >
                            Upload
                          </Button>
                        </div>
                      )}

                      {imagePreview && (
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                      )}

                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileUpload}
                          onChange={handleFileChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Image
                          src={locationIcon || "/placeholder.svg"}
                          alt="Location"
                          width={20}
                          height={20}
                        />
                      </div>
                      <Input
                        placeholder="Event location or online"
                        {...field}
                        className="pl-12 h-[54px] rounded-full bg-gray-50"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Price Field */}
            <div className="relative w-full flex items-center">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                          <Image
                            src={priceIcon || "/placeholder.svg"}
                            alt="Price"
                            width={20}
                            height={20}
                          />
                        </div>
                        <Input
                          placeholder="Price"
                          {...field}
                          className="pl-12 h-[54px] rounded-full bg-gray-50 w-full"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFree"
                render={({ field }) => (
                  <FormItem className="absolute right-4 flex items-center">
                    <label
                      htmlFor="isFree"
                      className="whitespace-nowrap pr-3 leading-none peer-disabled:opacity-70"
                    >
                      Free Ticket
                    </label>
                    <FormControl>
                      <Checkbox
                        id="isFree"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5 border-2 border-violet-600"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* URL */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Image
                          src={urlIcon || "/placeholder.svg"}
                          alt="URL"
                          width={20}
                          height={20}
                        />
                      </div>
                      <Input
                        placeholder="URL"
                        onChange={field.onChange}
                        value={field.value}
                        className="pl-12 h-[54px] rounded-full bg-gray-50"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Date */}
            <FormField
              control={form.control}
              name="startDateTime"
              render={({ field }) => (
                <FormItem>
                  <p>Start Date:</p>
                  <FormControl>
                    <div className="relative w-full flex items-center">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Image
                          src={calenderIcon || "/placeholder.svg"}
                          alt="Calendar"
                          width={20}
                          height={20}
                        />
                      </div>
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        timeInputLabel="Time:"
                        dateFormat="MM/dd/yy h:mm aa"
                        placeholderText="Start Date:"
                        className="pl-12 py-2 text-sm px-4 w-full border-none focus:outline-none rounded-md cursor-pointer"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date */}
            <FormField
              control={form.control}
              name="endDateTime"
              render={({ field }) => (
                <FormItem>
                  <p>End Date:</p>
                  <FormControl>
                    <div className="relative w-full flex items-center">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Image
                          src={calenderIcon || "/placeholder.svg"}
                          alt="Calendar"
                          width={20}
                          height={20}
                        />
                      </div>
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        timeInputLabel="Time:"
                        dateFormat="MM/dd/yy h:mm aa"
                        placeholderText="End Date:"
                        className="pl-12 py-2 text-sm px-4 w-full border-none focus:outline-none rounded-md cursor-pointer"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-500 rounded-3xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Event..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventForm;
