import { useState, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputArea } from "@/components/ui/input-area";
import { PencilSquareIcon, UserPlusIcon } from "@heroicons/react/24/outline";

const formSchema = z.object({
  tags: z.string().min(0).max(200),
  name: z.string().min(0).max(200),
  description: z.string().min(0).max(200),
  greeting: z.string().min(0).max(200),
  message_example: z.string().min(0).max(200)
});

function CreationPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [characterName, setCharacterName] = useState("");
  const [characterDescription, setCharacterDescription] = useState("");
  const [greetingMessage, setGreetingMessage] = useState("");
  const [exampleMessages, setExampleMessages] = useState("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const bannerInput = useRef(null);
  const profileInput = useRef(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      greeting: "",
      message_example: ""
    }
  });

  //TODO: Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const handleBannerClick = () => {
    bannerInput.current.click();
  };

  const handleProfileClick = () => {
    profileInput.current.click();
  };

  const handleBannerChange = (event) => {
    const file = event.target.files[0];
    setBannerImage(file);
  };

  const handleProfileChange = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
  };

  return (
    <div className="flex w-full items-center justify-center rounded-lg bg-background">
      <div className="w-[46rem] rounded-lg bg-neutral-800">
        {/* Banner and profile picture */}
        <div className="relative rounded-lg">
          <div
            className="flex h-48 w-full  cursor-pointer items-center justify-center overflow-hidden rounded-t-lg bg-gradient-to-br from-neutral-700 to-neutral-500 object-cover"
            onClick={handleBannerClick}
          >
            {profileImage ? (
              <img src={URL.createObjectURL(profileImage)} alt="Profile" className="absolute" />
            ) : (
              <PencilSquareIcon className="absolute h-12 w-12 text-neutral-300" />
            )}
            <div className="absolute  inset-0 bg-black opacity-0 transition-opacity duration-200 hover:opacity-30"></div>
            <input
              type="file"
              style={{ display: "none" }}
              ref={bannerInput}
              onChange={handleBannerChange}
              accept=".jpg,.jpeg,.png"
            />
          </div>
          <div
            className="absolute -bottom-12 left-4 flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-neutral-700 to-neutral-600"
            onClick={handleProfileClick}
          >
            {profileImage ? (
              <img src={URL.createObjectURL(profileImage)} alt="Profile" className="absolute" />
            ) : (
              <PencilSquareIcon className="absolute h-8 w-8 text-neutral-300" />
            )}
            <div className="absolute  inset-0 bg-black opacity-0 transition-opacity duration-200 hover:opacity-30"></div>
            <input
              type="file"
              style={{ display: "none" }}
              ref={profileInput}
              onChange={handleProfileChange}
              accept=".jpg,.jpeg,.png"
            />
          </div>
        </div>
        {/* Character details container */}
        <div className="px-6 pb-6 pt-12">
          <div className="flex flex-col pt-8">
            {/* Character details form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Character Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="add character name"
                          className="border-neutral-700 focus-visible:ring-neutral-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="add comma separated list of tags"
                          className="scroll-tertiary border-neutral-700 focus-visible:ring-neutral-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Character Description</FormLabel>
                      <FormControl>
                        <InputArea
                          placeholder="add character description"
                          className="scroll-tertiary border-neutral-700 focus-visible:ring-neutral-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="greeting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Character Greeting</FormLabel>
                      <FormControl>
                        <InputArea
                          placeholder="add character greeting"
                          className="scroll-tertiary border-neutral-700 focus-visible:ring-neutral-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message_example"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message Examples</FormLabel>
                      <FormControl>
                        <InputArea
                          placeholder="add message examples"
                          className="scroll-tertiary border-neutral-700 focus-visible:ring-neutral-400 "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <button
                    className="flex items-center space-x-2 rounded-md bg-neutral-700 px-4 py-2 transition-colors duration-200 hover:bg-neutral-600"
                    type="submit"
                  >
                    <UserPlusIcon className="size-5" />
                    <span className="font-medium text-neutral-200">Create</span>
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreationPage;
