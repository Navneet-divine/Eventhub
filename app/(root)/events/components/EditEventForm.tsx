"use client";

import type React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useState, useRef } from "react";
import Image from "next/image";
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
import Dropdown from "./Dropdown";
import { CloudUpload } from "lucide-react";

import locationIcon from "@/public/icons/location-grey.svg";
import calenderIcon from "@/public/icons/calendar.svg";
import urlIcon from "@/public/icons/link.svg";
import priceIcon from "@/public/icons/dollar.svg";

import { editEvent } from "@/lib/actions/event.actions";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof evnetFormSchema>;

interface EditEventFormProps {
  eventId: string;
  event: {
    _id: string;
    title: string;
    description: string;
    location: string;
    imageUrl?: string;
    price: string;
    url: string;
    isFree: boolean;
    category: string;
    startDateTime: Date;
    endDateTime: Date;
  };
}

const EditEventForm: React.FC<EditEventFormProps> = ({ event, eventId }) => {
  const [filedValue, setFieledVlue] = useState({
    title: event.title,
    description: event.description,
    location: event.location,
    imageUrl: event.imageUrl,
    price: event.price,
    url: event.url,
    isFree: event.isFree,
    category: event.category,
    startDateTime: new Date(event.startDateTime),
    endDateTime: new Date(event.endDateTime),
  });
  const router = useRouter();

  const fileUpload = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    event.imageUrl ?? null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(evnetFormSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      location: event.location,
      imageUrl: event.imageUrl || "",
      price: event.price,
      url: event.url,
      isFree: event.isFree,
      category: event.category,
      startDateTime: new Date(event.startDateTime),
      endDateTime: new Date(event.endDateTime),
    },
  });

  const handleUploadFile = () => {
    fileUpload.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      form.setValue("imageUrl", "image-will-be-uploaded");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      form.setValue("imageUrl", "image-will-be-uploaded");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      Object.entries(filedValue).forEach(([key, value]) => {
        if (key !== "imageUrl" && value !== undefined && value !== null) {
          if (key === "startDateTime" || key === "endDateTime") {
            formData.append(
              key,
              value instanceof Date
                ? value.toISOString()
                : new Date(
                    typeof value === "string" || typeof value === "number"
                      ? value
                      : ""
                  ).toISOString()
            );
          } else {
            formData.append(key, String(value));
          }
        }
      });

      if (imageFile) {
        formData.append("imageUrl", imageFile);
      } else if (event.imageUrl) {
        // Keep the existing image if no new one was uploaded
        formData.append("imageUrl", event.imageUrl);
      }

      const result = await editEvent(eventId as string, formData);
      console.log(result);

      if (result.success === false) {
        console.error("Error updating event:", result.error);
      } else {
        form.reset();
        setImagePreview(null);
        setImageFile(null);
        router.push(`/events/event-detail/${result._id}`);
      }
    } catch (error) {
      console.error("Failed to update event:", error);
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
                      value={filedValue.title}
                      onChange={(e) => {
                        field.onChange(e.target.value); // Make sure to pass the value, not the event
                        setFieledVlue({ ...filedValue, title: e.target.value });
                      }}
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
                      value={filedValue.category}
                      hideAddCategory={false}
                      hideAllCategory={false}
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
                        value={filedValue.description}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setFieledVlue({
                            ...filedValue,
                            description: e.target.value,
                          });
                        }}
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
                render={() => (
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
                          onChange={(e) => {
                            handleFileChange(e);
                            form.clearErrors("imageUrl");
                          }}
                        />
                      </FormControl>
                    </div>
                    {imagePreview === "" ? <FormMessage /> : <FormMessage />}
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
                        value={filedValue.location}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setFieledVlue({
                            ...filedValue,
                            location: e.target.value,
                          });
                        }}
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
                          value={filedValue.price}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setFieledVlue({
                              ...filedValue,
                              price: e.target.value,
                            });
                          }}
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
                        checked={filedValue.isFree}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          setFieledVlue({
                            ...filedValue,
                            isFree: Boolean(checked),
                          });
                        }}
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
                        value={filedValue.url}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setFieledVlue({ ...filedValue, url: e.target.value });
                        }}
                        type="url"
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
                        selected={
                          filedValue.startDateTime instanceof Date
                            ? filedValue.startDateTime
                            : new Date(filedValue.startDateTime)
                        }
                        onChange={(date) => {
                          if (date) {
                            field.onChange(date);
                            setFieledVlue({
                              ...filedValue,
                              startDateTime: date,
                            });
                          }
                        }}
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
                        selected={
                          filedValue.endDateTime instanceof Date
                            ? filedValue.endDateTime
                            : new Date(filedValue.endDateTime)
                        }
                        onChange={(date) => {
                          if (date) {
                            field.onChange(date);
                            setFieledVlue({ ...filedValue, endDateTime: date });
                          }
                        }}
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

export default EditEventForm;
